const mongoose = require('mongoose');
const Content = require('../model/Content');
require('dotenv').config();

const initialContents = [
    {
        type: 'about',
        title: 'About Us',
        content: [
            {
                contentTitle: "Welcome to Kura Fashion",
                contentInfo: "Welcome to Kura Fashion, where we believe in delivering the highest quality products and services to our customers. Founded in 2016, we have grown from a small startup to a trusted name in the industry."
            },
            {
                contentTitle: "Our Specialization",
                contentInfo: "At Kura Fashion, we specialize in modern, wonderful, and comfortable clothes. Our team of experienced professionals works tirelessly to ensure that every product we offer meets the highest standards of quality."
            },
            {
                contentTitle: "Our Mission",
                contentInfo: "Our mission is to create value for our customers by offering superior products and exceptional customer service. We believe in building lasting relationships with our customers, partners, and the communities we serve."
            }
        ]
    },
    {
        type: 'privacy',
        title: 'Privacy Policy',
        content: [
            {
                contentTitle: "Information Collection",
                contentInfo: "We may collect personal information such as your name, email address, phone number, and payment details when you interact with our website."
            },
            {
                contentTitle: "Information Usage",
                contentInfo: "We use your personal information to process transactions, provide customer service, send marketing communications, and improve our website and services."
            },
            {
                contentTitle: "Data Protection",
                contentInfo: "We do not sell, trade, or otherwise transfer your personal information to outside parties except trusted third parties who assist us in operating our website."
            }
        ]
    },
    {
        type: 'terms',
        title: 'Terms and Conditions',
        content: [
            {
                contentTitle: "Introduction",
                contentInfo: "Welcome to Kura Fashion. These terms and conditions outline the rules and regulations for the use of our website and services."
            },
            {
                contentTitle: "Intellectual Property Rights",
                contentInfo: "Unless otherwise stated, Kura Fashion and/or its licensors own the intellectual property rights for all material on this website."
            },
            {
                contentTitle: "Restrictions",
                contentInfo: "You are specifically restricted from publishing any website material in any other media, selling or commercializing website material, and data mining."
            }
        ]
    },
    {
        type: 'shipping',
        title: 'Shipping Policy',
        content: [
            {
                contentTitle: "Shipping Methods and Delivery Time",
                contentInfo: "We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Overnight Shipping (1 business day)."
            },
            {
                contentTitle: "Order Processing Time",
                contentInfo: "All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays."
            },
            {
                contentTitle: "International Shipping",
                contentInfo: "We currently offer international shipping to select countries. Additional charges such as customs duties and taxes may apply."
            }
        ]
    },
    {
        type: 'refund',
        title: 'Refund Policy',
        content: [
            {
                contentTitle: "Returns",
                contentInfo: "You may return any item purchased from us within 10 days of receiving it, provided the item is unused and in its original packaging."
            },
            {
                contentTitle: "Refund Process",
                contentInfo: "Once we receive and inspect your returned item, we will notify you of the status of your refund. If approved, refunds will be processed within 10 days."
            },
            {
                contentTitle: "Exchanges",
                contentInfo: "We only replace items if they are defective or damaged. Please contact us at nilayrathod129@gmail.com for exchanges."
            }
        ]
    }
];

const initializeContent = async () => {
    try {
        await mongoose.connect(process.env.URL);
        console.log('Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('Cleared existing content');

        // Insert new content
        const result = await Content.insertMany(initialContents);
        console.log('Content initialized successfully:', result);

    } catch (error) {
        console.error('Error initializing content:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
};

initializeContent();
