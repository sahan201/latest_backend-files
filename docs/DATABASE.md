***Database Schema

''Collections''

Users
{
\_id: ObjectId,
name: String,
email: String,
password: String, // hashed
role: String, // 'admin', 'manager', 'technician', 'customer'
phone: String,
createdAt: Date,
updatedAt: Date
}

services
{
{
\_id: ObjectId,
customer: ObjectId, // ref: User
vehicle: {
make: String,
model: String,
year: Number,
licensePlate: String
},
serviceType: String,
description: String,
status: String, // 'pending', 'in-progress', 'completed', 'cancelled'
assignedTo: ObjectId, // ref: User (technician)
scheduledDate: Date,
completedDate: Date,
createdAt: Date,
updatedAt: Date
}
}

inventory
{
{
\_id: ObjectId,
partName: String,
partNumber: String,
quantity: Number,
minQuantity: Number, // alert threshold
unitPrice: Number,
supplier: String,
lastRestocked: Date,
createdAt: Date,
updatedAt: Date
}

}

invoices
{
{
\_id: ObjectId,
service: ObjectId, // ref: Service
customer: ObjectId, // ref: User
items: [{
description: String,
quantity: Number,
unitPrice: Number,
total: Number
}],
subtotal: Number,
tax: Number,
total: Number,
status: String, // 'pending', 'paid', 'overdue'
sentAt: Date,
paidAt: Date,
createdAt: Date
}

}

complaints
{
{
\_id: ObjectId,
customer: ObjectId, // ref: User
service: ObjectId, // ref: Service
subject: String,
description: String,
status: String, // 'open', 'in-progress', 'resolved', 'closed'
priority: String, // 'low', 'medium', 'high'
resolvedBy: ObjectId, // ref: User
resolvedAt: Date,
createdAt: Date
}

}

feedback
{
{
\_id: ObjectId,
customer: ObjectId, // ref: User
service: ObjectId, // ref: Service
rating: Number, // 1-5
comment: String,
createdAt: Date
}

}
