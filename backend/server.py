from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import stripe
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')

# JWT configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-jwt-secret-key')
JWT_ALGORITHM = 'HS256'

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: str = "customer"  # customer, pharmacist, admin
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    stock: int
    image: str
    category: str
    requiresPrescription: bool = False
    strength: Optional[str] = None
    manufacturer: Optional[str] = None
    sideEffects: Optional[str] = None
    usage: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image: str
    category: str
    requiresPrescription: bool = False
    strength: Optional[str] = None
    manufacturer: Optional[str] = None
    sideEffects: Optional[str] = None
    usage: Optional[str] = None

class CartItem(BaseModel):
    productId: str
    quantity: int
    name: str
    price: float
    image: str

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    items: List[CartItem] = []
    total: float = 0.0
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Address(BaseModel):
    street: str
    city: str
    state: str
    zip: str
    country: str = "USA"

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    items: List[CartItem]
    total: float
    status: str = "pending"  # pending, confirmed, shipped, delivered, cancelled
    address: Address
    paymentIntentId: Optional[str] = None
    prescriptionId: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    items: List[CartItem]
    total: float
    address: Address
    prescriptionId: Optional[str] = None

class Prescription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    patientName: str
    fileData: str  # base64 encoded
    fileName: str
    status: str = "received"  # received, under-review, approved, rejected
    pharmacistNotes: Optional[str] = None
    reviewedBy: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PrescriptionUpdate(BaseModel):
    status: str
    pharmacistNotes: Optional[str] = None

class PaymentIntentRequest(BaseModel):
    amount: float

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0, 'password': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(user: dict = Depends(get_current_user)):
    if user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def get_current_pharmacist(user: dict = Depends(get_current_user)):
    if user['role'] not in ['pharmacist', 'admin']:
        raise HTTPException(status_code=403, detail="Pharmacist access required")
    return user

# Auth endpoints
@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    existing = await db.users.find_one({'email': user_data.email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        phone=user_data.phone
    )
    
    user_dict = user.model_dump()
    user_dict['password'] = hashed_pw
    user_dict['createdAt'] = user_dict['createdAt'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    token = create_token(user.id, user.email, user.role)
    return {'token': token, 'user': user.model_dump()}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'], user['role'])
    user.pop('password')
    return {'token': token, 'user': user}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

# Product endpoints
@api_router.get("/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None, requiresPrescription: Optional[bool] = None):
    query = {}
    if category:
        query['category'] = category
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    if requiresPrescription is not None:
        query['requiresPrescription'] = requiresPrescription
    
    products = await db.products.find(query, {'_id': 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({'id': product_id}, {'_id': 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Cart endpoints
@api_router.get("/cart")
async def get_cart(user: dict = Depends(get_current_user)):
    cart = await db.carts.find_one({'userId': user['id']}, {'_id': 0})
    if not cart:
        cart = Cart(userId=user['id']).model_dump()
        cart['updatedAt'] = cart['updatedAt'].isoformat()
        await db.carts.insert_one(cart)
    return cart

@api_router.post("/cart")
async def update_cart(items: List[CartItem], user: dict = Depends(get_current_user)):
    total = sum(item.price * item.quantity for item in items)
    cart = Cart(userId=user['id'], items=items, total=total)
    
    cart_dict = cart.model_dump()
    cart_dict['updatedAt'] = cart_dict['updatedAt'].isoformat()
    
    await db.carts.update_one(
        {'userId': user['id']},
        {'$set': cart_dict},
        upsert=True
    )
    return cart_dict

@api_router.delete("/cart")
async def clear_cart(user: dict = Depends(get_current_user)):
    await db.carts.delete_one({'userId': user['id']})
    return {'message': 'Cart cleared'}

# Order endpoints
@api_router.get("/orders")
async def get_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find({'userId': user['id']}, {'_id': 0}).sort('createdAt', -1).to_list(100)
    return orders

@api_router.post("/orders")
async def create_order(order_data: OrderCreate, user: dict = Depends(get_current_user)):
    order = Order(
        userId=user['id'],
        items=order_data.items,
        total=order_data.total,
        address=order_data.address,
        prescriptionId=order_data.prescriptionId
    )
    
    order_dict = order.model_dump()
    order_dict['createdAt'] = order_dict['createdAt'].isoformat()
    
    await db.orders.insert_one(order_dict)
    await db.carts.delete_one({'userId': user['id']})
    
    return order_dict

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({'id': order_id, 'userId': user['id']}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Prescription endpoints
@api_router.post("/prescriptions")
async def upload_prescription(patientName: str = Form(...), file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    file_content = await file.read()
    file_data = base64.b64encode(file_content).decode('utf-8')
    
    prescription = Prescription(
        userId=user['id'],
        patientName=patientName,
        fileData=file_data,
        fileName=file.filename
    )
    
    prescription_dict = prescription.model_dump()
    prescription_dict['createdAt'] = prescription_dict['createdAt'].isoformat()
    prescription_dict['updatedAt'] = prescription_dict['updatedAt'].isoformat()
    
    await db.prescriptions.insert_one(prescription_dict)
    return prescription_dict

@api_router.get("/prescriptions")
async def get_prescriptions(user: dict = Depends(get_current_user)):
    prescriptions = await db.prescriptions.find({'userId': user['id']}, {'_id': 0, 'fileData': 0}).sort('createdAt', -1).to_list(100)
    return prescriptions

@api_router.get("/prescriptions/{prescription_id}")
async def get_prescription(prescription_id: str, user: dict = Depends(get_current_user)):
    prescription = await db.prescriptions.find_one({'id': prescription_id, 'userId': user['id']}, {'_id': 0})
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return prescription

# Payment endpoints
@api_router.post("/payment/create-intent")
async def create_payment_intent(request: PaymentIntentRequest, user: dict = Depends(get_current_user)):
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(request.amount * 100),  # Convert to cents
            currency='usd',
            metadata={'user_id': user['id']}
        )
        return {'clientSecret': intent.client_secret, 'paymentIntentId': intent.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Admin endpoints
@api_router.get("/admin/users")
async def get_all_users(user: dict = Depends(get_current_admin)):
    users = await db.users.find({}, {'_id': 0, 'password': 0}).to_list(1000)
    return users

@api_router.post("/admin/products")
async def create_product(product: ProductCreate, user: dict = Depends(get_current_admin)):
    product_obj = Product(**product.model_dump())
    product_dict = product_obj.model_dump()
    await db.products.insert_one(product_dict)
    return product_dict

@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, product: ProductCreate, user: dict = Depends(get_current_admin)):
    await db.products.update_one({'id': product_id}, {'$set': product.model_dump()})
    return {'message': 'Product updated'}

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_admin)):
    await db.products.delete_one({'id': product_id})
    return {'message': 'Product deleted'}

@api_router.get("/admin/orders")
async def get_all_orders(user: dict = Depends(get_current_admin)):
    orders = await db.orders.find({}, {'_id': 0}).sort('createdAt', -1).to_list(1000)
    return orders

@api_router.put("/admin/orders/{order_id}")
async def update_order_status(order_id: str, status: str, user: dict = Depends(get_current_admin)):
    await db.orders.update_one({'id': order_id}, {'$set': {'status': status}})
    return {'message': 'Order status updated'}

# Pharmacist endpoints
@api_router.get("/pharmacist/prescriptions")
async def get_all_prescriptions(user: dict = Depends(get_current_pharmacist)):
    prescriptions = await db.prescriptions.find({}, {'_id': 0, 'fileData': 0}).sort('createdAt', -1).to_list(1000)
    return prescriptions

@api_router.put("/pharmacist/prescriptions/{prescription_id}")
async def update_prescription(prescription_id: str, update: PrescriptionUpdate, user: dict = Depends(get_current_pharmacist)):
    update_dict = update.model_dump()
    update_dict['reviewedBy'] = user['id']
    update_dict['updatedAt'] = datetime.now(timezone.utc).isoformat()
    
    await db.prescriptions.update_one({'id': prescription_id}, {'$set': update_dict})
    return {'message': 'Prescription updated'}

@api_router.get("/categories")
async def get_categories():
    return [
        {'id': 'rx-medicines', 'name': 'Rx Medicines', 'icon': 'pill'},
        {'id': 'wellness', 'name': 'Wellness', 'icon': 'heart'},
        {'id': 'devices', 'name': 'Medical Devices', 'icon': 'stethoscope'},
        {'id': 'baby-care', 'name': 'Baby Care', 'icon': 'baby'}
    ]

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def seed_data():
    # Check if products exist
    count = await db.products.count_documents({})
    if count == 0:
        # Seed products
        sample_products = [
            {
                'id': str(uuid.uuid4()),
                'name': 'Amoxicillin 500mg',
                'description': 'Antibiotic for bacterial infections',
                'price': 12.99,
                'stock': 100,
                'image': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
                'category': 'rx-medicines',
                'requiresPrescription': True,
                'strength': '500mg',
                'manufacturer': 'Generic Pharma',
                'usage': 'Take one capsule every 8 hours',
                'sideEffects': 'Nausea, diarrhea, allergic reactions'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Vitamin D3 1000 IU',
                'description': 'Daily vitamin supplement for bone health',
                'price': 8.99,
                'stock': 200,
                'image': 'https://images.unsplash.com/photo-1550572017-4fa3e06eb24f?w=400',
                'category': 'wellness',
                'requiresPrescription': False,
                'strength': '1000 IU',
                'manufacturer': 'Health Plus'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Digital Thermometer',
                'description': 'Fast and accurate temperature readings',
                'price': 15.99,
                'stock': 50,
                'image': 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400',
                'category': 'devices',
                'requiresPrescription': False,
                'manufacturer': 'MedTech'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Baby Gentle Soap',
                'description': 'Hypoallergenic soap for sensitive skin',
                'price': 6.99,
                'stock': 150,
                'image': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
                'category': 'baby-care',
                'requiresPrescription': False,
                'manufacturer': 'BabyCare'
            }
        ]
        await db.products.insert_many(sample_products)
        logger.info(f"Seeded {len(sample_products)} products")
    
    # Create admin user if doesn't exist
    admin = await db.users.find_one({'email': 'admin@wellnest.com'}, {'_id': 0})
    if not admin:
        admin_user = {
            'id': str(uuid.uuid4()),
            'email': 'admin@wellnest.com',
            'password': hash_password('admin123'),
            'name': 'Admin User',
            'role': 'admin',
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_user)
        logger.info("Created admin user: admin@wellnest.com / admin123")