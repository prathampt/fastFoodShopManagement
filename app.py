from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database setup (SQLite)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fastfood.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    contact = db.Column(db.String(120), nullable=False)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    person = db.relationship('Person', backref=db.backref('customer', lazy=True))

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    shift = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    person = db.relationship('Person', backref=db.backref('employee', lazy=True))

class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    availability = db.Column(db.Boolean, default=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    order_date = db.Column(db.String(50), nullable=False)
    order_time = db.Column(db.String(50), nullable=False)
    customer = db.relationship('Customer', backref=db.backref('order', lazy=True))

class OrderDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food_item.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    order = db.relationship('Order', backref=db.backref('order_details', lazy=True))
    food_item = db.relationship('FoodItem', backref=db.backref('order_details', lazy=True))

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    order = db.relationship('Order', backref=db.backref('payment', lazy=True))

# Create the database tables
with app.app_context():
    db.create_all()

# CRUD operations for Person
@app.route('/persons', methods=['POST'])
def create_person():
    data = request.json
    new_person = Person(name=data['name'], age=data['age'], gender=data['gender'], contact=data['contact'])
    db.session.add(new_person)
    db.session.commit()
    return jsonify({'message': 'Person created successfully!'}), 201

@app.route('/persons', methods=['GET'])
def get_persons():
    persons = Person.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'age': p.age, 'gender': p.gender, 'contact': p.contact} for p in persons])

@app.route('/persons/<int:id>', methods=['PUT'])
def update_person(id):
    data = request.json
    person = Person.query.get(id)
    if not person:
        return jsonify({'message': 'Person not found!'}), 404
    person.name = data['name']
    person.age = data['age']
    person.gender = data['gender']
    person.contact = data['contact']
    db.session.commit()
    return jsonify({'message': 'Person updated successfully!'}), 200

@app.route('/persons/<int:id>', methods=['DELETE'])
def delete_person(id):
    person = Person.query.get(id)
    if not person:
        return jsonify({'message': 'Person not found!'}), 404
    db.session.delete(person)
    db.session.commit()
    return jsonify({'message': 'Person deleted successfully!'}), 200

# FoodItem routes
@app.route('/fooditems', methods=['GET'])
def get_fooditems():
    fooditems = FoodItem.query.all()
    return jsonify([{"id": f.id, "name": f.name, "price": f.price, "availability": f.availability} for f in fooditems])

@app.route('/fooditems', methods=['POST'])
def add_fooditem():
    data = request.get_json()
    new_fooditem = FoodItem(name=data['name'], price=data['price'], availability=True if data['availability'] == 'true' else False)
    db.session.add(new_fooditem)
    db.session.commit()
    return jsonify({"message": "FoodItem added successfully"})

@app.route('/fooditems/<int:id>', methods=['PUT'])
def update_fooditem(id):
    fooditem = FoodItem.query.get(id)
    data = request.get_json()
    if fooditem:
        fooditem.name = data['name']
        fooditem.price = data['price']
        fooditem.availability = data['availability']
        db.session.commit()
        return jsonify({"message": "FoodItem updated successfully"})
    return jsonify({"message": "FoodItem not found"}), 404

@app.route('/fooditems/<int:id>', methods=['DELETE'])
def delete_fooditem(id):
    fooditem = FoodItem.query.get(id)
    if fooditem:
        db.session.delete(fooditem)
        db.session.commit()
        return jsonify({"message": "FoodItem deleted successfully"})
    return jsonify({"message": "FoodItem not found"}), 404

# CRUD operations for Customer
@app.route('/customers', methods=['POST'])
def create_customer():
    data = request.json
    person = Person.query.get(data['person_id'])
    if not person:
        return jsonify({'message': 'Person not found!'}), 404
    new_customer = Customer(person_id=data['person_id'])
    db.session.add(new_customer)
    db.session.commit()
    return jsonify({'message': 'Customer created successfully!'}), 201

@app.route('/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([{'id': c.id, 'person_id': c.person_id, 'name': c.person.name} for c in customers])

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    customer = Customer.query.get(id)
    data = request.json
    if not customer:
        return jsonify({'message': 'Customer not found!'}), 404
    customer.person_id = data['person_id']
    db.session.commit()
    return jsonify({'message': 'Customer updated successfully!'}), 200

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = Customer.query.get(id)
    if not customer:
        return jsonify({'message': 'Customer not found!'}), 404
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Customer deleted successfully!'}), 200

# CRUD operations for Employee
@app.route('/employees', methods=['POST'])
def create_employee():
    data = request.json
    person = Person.query.get(data['person_id'])
    if not person:
        return jsonify({'message': 'Person not found!'}), 404
    new_employee = Employee(person_id=data['person_id'], shift=data['shift'], role=data['role'])
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({'message': 'Employee created successfully!'}), 201

@app.route('/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    return jsonify([{'id': e.id, 'person_id': e.person_id, 'shift': e.shift, 'role': e.role, 'name': e.person.name} for e in employees])

@app.route('/employees/<int:id>', methods=['PUT'])
def update_employee(id):
    employee = Employee.query.get(id)
    data = request.json
    if not employee:
        return jsonify({'message': 'Employee not found!'}), 404
    employee.shift = data['shift']
    employee.role = data['role']
    db.session.commit()
    return jsonify({'message': 'Employee updated successfully!'}), 200

@app.route('/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({'message': 'Employee not found!'}), 404
    db.session.delete(employee)
    db.session.commit()
    return jsonify({'message': 'Employee deleted successfully!'}), 200

# CRUD operations for Order
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    customer = Customer.query.get(data['customer_id'])
    if not customer:
        return jsonify({'message': 'Customer not found!'}), 404
    new_order = Order(customer_id=data['customer_id'], order_date=data['order_date'], order_time=data['order_time'])
    db.session.add(new_order)
    db.session.commit()
    return jsonify({'message': 'Order created successfully!'}), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([{'id': o.id, 'customer_id': o.customer_id, 'order_date': o.order_date, 'order_time': o.order_time} for o in orders])

@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get(id)
    data = request.json
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    order.customer_id = data['customer_id']
    order.order_date = data['order_date']
    order.order_time = data['order_time']
    db.session.commit()
    return jsonify({'message': 'Order updated successfully!'}), 200

@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get(id)
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully!'}), 200

# CRUD operations for OrderDetails
@app.route('/orderdetails', methods=['POST'])
def create_orderdetails():
    data = request.json
    order = Order.query.get(data['order_id'])
    food_item = FoodItem.query.get(data['food_id'])
    if not order or not food_item:
        return jsonify({'message': 'Order or FoodItem not found!'}), 404
    new_orderdetails = OrderDetails(order_id=data['order_id'], food_id=data['food_id'], quantity=data['quantity'])
    db.session.add(new_orderdetails)
    db.session.commit()
    return jsonify({'message': 'OrderDetails created successfully!'}), 201

@app.route('/orderdetails', methods=['GET'])
def get_orderdetails():
    details = OrderDetails.query.all()
    return jsonify([{'id': d.id, 'order_id': d.order_id, 'food_id': d.food_id, 'quantity': d.quantity} for d in details])

@app.route('/orderdetails/<int:id>', methods=['PUT'])
def update_orderdetails(id):
    orderdetails = OrderDetails.query.get(id)
    data = request.json
    if not orderdetails:
        return jsonify({'message': 'OrderDetails not found!'}), 404
  
# CRUD operations for Payment
@app.route('/payments', methods=['POST'])
def create_payment():
    data = request.json
    order = Order.query.get(data['order_id'])
    if not order:
        return jsonify({'message': 'Order not found!'}), 404
    new_payment = Payment(order_id=data['order_id'], payment_type=data['payment_type'], total_amount=data['total_amount'])
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({'message': 'Payment created successfully!'}), 201

@app.route('/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify([{'id': p.id, 'order_id': p.order_id, 'payment_type': p.payment_type, 'total_amount': p.total_amount} for p in payments])

@app.route('/payments/<int:id>', methods=['PUT'])
def update_payment(id):
    payment = Payment.query.get(id)
    data = request.json
    if not payment:
        return jsonify({'message': 'Payment not found!'}), 404
    payment.payment_type = data['payment_type']
    payment.total_amount = data['total_amount']
    db.session.commit()
    return jsonify({'message': 'Payment updated successfully!'}), 200

@app.route('/payments/<int:id>', methods=['DELETE'])
def delete_payment(id):
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({'message': 'Payment not found!'}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Payment deleted successfully!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
