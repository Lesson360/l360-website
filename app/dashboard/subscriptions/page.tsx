import React from 'react';
import { CreditCard } from 'lucide-react';

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#FF4801] tracking-tight">
                Subscriptions
            </h1>
            <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-md text-center space-y-4 max-w-xl">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Subscription Plans & Billing</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Manage active child subscriptions, view payment invoices, or upgrade learning plans.
                </p>
            </div>
        </div>
    );
}
