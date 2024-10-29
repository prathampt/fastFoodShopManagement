document.addEventListener("DOMContentLoaded", () => {
    // API base URL
    const API_BASE_URL = "http://localhost:5000";

    // ========== PERSON ========== //
    const personForm = document.getElementById('person-form');
    const personsTable = document.getElementById('persons-table');

    const fetchPersons = () => {
        fetch(`${API_BASE_URL}/persons`)
            .then(response => response.json())
            .then(persons => {
                personsTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                persons.forEach(person => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${person.id}</td>
                        <td>${person.name}</td>
                        <td>${person.age}</td>
                        <td>${person.gender}</td>
                        <td>${person.contact}</td>
                        <td><button onclick="editPerson(${person.id})">Edit</button></td>
                        <td><button onclick="deletePerson(${person.id})">Delete</button></td>
                    `;
                    personsTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching persons:', err));
    };

    personForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const personData = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            contact: document.getElementById('contact').value
        };
        fetch(`${API_BASE_URL}/persons`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personData)
        })
        .then(() => {
            fetchPersons();
            personForm.reset();
        })
        .catch(err => console.error('Error adding person:', err));
    });

    window.editPerson = (id) => {
        const newName = prompt("Enter new name:");
        const newAge = prompt("Enter new age:");
        const newGender = prompt("Enter new gender:");
        const newContact = prompt("Enter new contact:");
        const updatedData = { name: newName, age: newAge, gender: newGender, contact: newContact };
        fetch(`${API_BASE_URL}/persons/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchPersons())
        .catch(err => console.error('Error updating person:', err));
    };

    window.deletePerson = (id) => {
        if (confirm("Are you sure you want to delete this person?")) {
            fetch(`${API_BASE_URL}/persons/${id}`, { method: 'DELETE' })
                .then(() => fetchPersons())
                .catch(err => console.error('Error deleting person:', err));
        }
    };

    fetchPersons();

    // ========== CUSTOMER ========== //
    const customerForm = document.getElementById('customer-form');
    const customersTable = document.getElementById('customers-table');

    const fetchCustomers = () => {
        fetch(`${API_BASE_URL}/customers`)
            .then(response => response.json())
            .then(customers => {
                customersTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Person ID</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                customers.forEach(customer => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${customer.id}</td>
                        <td>${customer.name}</td>
                        <td>${customer.person_id}</td>
                        <td><button onclick="editCustomer(${customer.id})">Edit</button></td>
                        <td><button onclick="deleteCustomer(${customer.id})">Delete</button></td>
                    `;
                    customersTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching customers:', err));
    };

    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerData = {
            person_id: document.getElementById('customer-person-id').value
        };
        fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(customerData)
        })
        .then(() => {
            fetchCustomers();
            customerForm.reset();
        })
        .catch(err => console.error('Error adding customer:', err));
    });

    window.editCustomer = (id) => {
        const newPersonId = prompt("Enter new Person ID:");
        const updatedData = { person_id: newPersonId };
        fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchCustomers())
        .catch(err => console.error('Error updating customer:', err));
    };

    window.deleteCustomer = (id) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE' })
                .then(() => fetchCustomers())
                .catch(err => console.error('Error deleting customer:', err));
        }
    };

    fetchCustomers();

    // ========== FOOD ITEM ========== //
    const foodItemForm = document.getElementById('foodItemForm');
    const foodItemsTable = document.getElementById('food-items-table');

    const fetchFoodItems = () => {
        fetch(`${API_BASE_URL}/fooditems`)
            .then(response => response.json())
            .then(foodItems => {
                foodItemsTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Availablility</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                foodItems.forEach(foodItem => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${foodItem.id}</td>
                        <td>${foodItem.name}</td>
                        <td>${foodItem.price}</td>
                        <td>${foodItem.availability}</td>
                        <td><button onclick="editFoodItem(${foodItem.id})">Edit</button></td>
                        <td><button onclick="deleteFoodItem(${foodItem.id})">Delete</button></td>
                    `;
                    foodItemsTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching food items:', err));
    };

    foodItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const foodItemData = {
            name: document.getElementById('foodName').value,
            price: document.getElementById('foodPrice').value,
            availability: document.getElementById('foodAvailability').value
        };
        fetch(`${API_BASE_URL}/fooditems`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodItemData)
        })
        .then(() => {
            fetchFoodItems();
            foodItemForm.reset();
        })
        .catch(err => console.error('Error adding food item:', err));
    });

    window.editFoodItem = (id) => {
        const newName = prompt("Enter new name:");
        const newPrice = prompt("Enter new price:");
        const newAvailability = prompt("Is it available? (true/false):");
        const updatedData = { name: newName, price: newPrice, availability: newAvailability };
        fetch(`${API_BASE_URL}/fooditems/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchFoodItems())
        .catch(err => console.error('Error updating food item:', err));
    };

    window.deleteFoodItem = (id) => {
        if (confirm("Are you sure you want to delete this food item?")) {
            fetch(`${API_BASE_URL}/fooditems/${id}`, { method: 'DELETE' })
                .then(() => fetchFoodItems())
                .catch(err => console.error('Error deleting food item:', err));
        }
    };

    fetchFoodItems();

    // ========== EMPLOYEE ========== //
    const employeeForm = document.getElementById('employee-form');
    const employeesTable = document.getElementById('employees-table');

    const fetchEmployees = () => {
        fetch(`${API_BASE_URL}/employees`)
            .then(response => response.json())
            .then(employees => {
                employeesTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Employee Name</th>
                        <th>Shift</th>
                        <th>Role</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                employees.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.id}</td>
                        <td>${employee.name}</td>
                        <td>${employee.shift}</td>
                        <td>${employee.role}</td>
                        <td><button onclick="editEmployee(${employee.id})">Edit</button></td>
                        <td><button onclick="deleteEmployee(${employee.id})">Delete</button></td>
                    `;
                    employeesTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching employees:', err));
    };

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const employeeData = {
            person_id: document.getElementById('employee-person-id').value,
            shift: document.getElementById('shift').value,
            role: document.getElementById('role').value
        };
        fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        })
        .then(() => {
            fetchEmployees();
            employeeForm.reset();
        })
        .catch(err => console.error('Error adding employee:', err));
    });

    window.editEmployee = (id) => {
        const newShift = prompt("Enter new shift:");
        const newRole = prompt("Enter new role:");
        const updatedData = { shift: newShift, role: newRole };
        fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchEmployees())
        .catch(err => console.error('Error updating employee:', err));
    };

    window.deleteEmployee = (id) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' })
                .then(() => fetchEmployees())
                .catch(err => console.error('Error deleting employee:', err));
        }
    };

    fetchEmployees();

    // ========== ORDER ========== //
    const orderForm = document.getElementById('order-form');
    const ordersTable = document.getElementById('orders-table');

    const fetchOrders = () => {
        fetch(`${API_BASE_URL}/orders`)
            .then(response => response.json())
            .then(orders => {
                ordersTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Customer ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                orders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.id}</td>
                        <td>${order.customer_id}</td>
                        <td>${order.order_date}</td>
                        <td>${order.order_time}</td>
                        <td><button onclick="editOrder(${order.id})">Edit</button></td>
                        <td><button onclick="deleteOrder(${order.id})">Delete</button></td>
                    `;
                    ordersTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching orders:', err));
    };

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderData = {
            customer_id: document.getElementById('customer-id').value,
            order_date: document.getElementById('order-date').value,
            order_time: document.getElementById('order-time').value
        };
        fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(() => {
            fetchOrders();
            orderForm.reset();
        })
        .catch(err => console.error('Error adding order:', err));
    });

    window.editOrder = (id) => {
        const newCustomerId = prompt("Enter new Customer ID:");
        const newDate = prompt("Enter new date:");
        const newTime = prompt("Enter new time:");
        const updatedData = { customer_id: newCustomerId, order_date: newDate, order_time: newTime };
        fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchOrders())
        .catch(err => console.error('Error updating order:', err));
    };

    window.deleteOrder = (id) => {
        if (confirm("Are you sure you want to delete this order?")) {
            fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE' })
                .then(() => fetchOrders())
                .catch(err => console.error('Error deleting order:', err));
        }
    };

    fetchOrders();

    // ========== ORDER DETAILS ========== //
    const orderDetailsForm = document.getElementById('orderDetails-form');
    const orderDetailsTable = document.getElementById('order-details-table');

    const fetchOrderDetails = () => {
        fetch(`${API_BASE_URL}/orderdetails`)
            .then(response => response.json())
            .then(orderDetails => {
                orderDetailsTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Food ID</th>
                        <th>Quantity</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                orderDetails.forEach(detail => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${detail.id}</td>
                        <td>${detail.order_id}</td>
                        <td>${detail.food_id}</td>
                        <td>${detail.quantity}</td>
                        <td><button onclick="editOrderDetails(${detail.id})">Edit</button></td>
                        <td><button onclick="deleteOrderDetails(${detail.id})">Delete</button></td>
                    `;
                    orderDetailsTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching order details:', err));
    };

    orderDetailsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderDetailsData = {
            order_id: document.getElementById('order-id').value,
            food_id: document.getElementById('food-id').value,
            quantity: document.getElementById('quantity').value
        };
        fetch(`${API_BASE_URL}/orderdetails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetailsData)
        })
        .then(() => {
            fetchOrderDetails();
            orderDetailsForm.reset();
        })
        .catch(err => console.error('Error adding order details:', err));
    });

    window.editOrderDetails = (id) => {
        const newFoodId = prompt("Enter new Food ID:");
        const newQuantity = prompt("Enter new quantity:");
        const updatedData = { food_id: newFoodId, quantity: newQuantity };
        fetch(`${API_BASE_URL}/orderdetails/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchOrderDetails())
        .catch(err => console.error('Error updating order details:', err));
    };

    window.deleteOrderDetails = (id) => {
        if (confirm("Are you sure you want to delete these order details?")) {
            fetch(`${API_BASE_URL}/orderdetails/${id}`, { method: 'DELETE' })
                .then(() => fetchOrderDetails())
                .catch(err => console.error('Error deleting order details:', err));
        }
    };

    fetchOrderDetails();

    // ========== PAYMENT ========== //
    const paymentForm = document.getElementById('payment-form');
    const paymentsTable = document.getElementById('payments-table');

    const fetchPayments = () => {
        fetch(`${API_BASE_URL}/payments`)
            .then(response => response.json())
            .then(payments => {
                paymentsTable.innerHTML = `
                    <tr>
                        <th>ID</th>
                        <th>Payment ID</th>
                        <th>Order ID</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                `;
                payments.forEach(payment => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${payment.id}</td>
                        <td>${payment.id}</td>
                        <td>${payment.order_id}</td>
                        <td>${payment.payment_type}</td>
                        <td>${payment.total_amount}</td>
                        <td><button onclick="editPayment(${payment.id})">Edit</button></td>
                        <td><button onclick="deletePayment(${payment.id})">Delete</button></td>
                    `;
                    paymentsTable.appendChild(row);
                });
            })
            .catch(err => console.error('Error fetching payments:', err));
    };

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const paymentData = {
            order_id: document.getElementById('payment-order-id').value,
            payment_type: document.getElementById('payment-type').value,
            total_amount: document.getElementById('total-amount').value
        };
        fetch(`${API_BASE_URL}/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        })
        .then(() => {
            fetchPayments();
            paymentForm.reset();
        })
        .catch(err => console.error('Error adding payment:', err));
    });

    window.editPayment = (id) => {
        const newPaymentType = prompt("Enter new payment type:");
        const newTotalAmount = prompt("Enter new total amount:");
        const updatedData = { payment_type: newPaymentType, total_amount: newTotalAmount };
        fetch(`${API_BASE_URL}/payments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(() => fetchPayments())
        .catch(err => console.error('Error updating payment:', err));
    };

    window.deletePayment = (id) => {
        if (confirm("Are you sure you want to delete this payment?")) {
            fetch(`${API_BASE_URL}/payments/${id}`, { method: 'DELETE' })
                .then(() => fetchPayments())
                .catch(err => console.error('Error deleting payment:', err));
        }
    };

    fetchPayments();
});
