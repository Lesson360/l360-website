'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PRICING_PLANS = [
    {
        name: 'Basic',
        price: '₦15,000',
        subtitle: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
        cardBg: 'bg-[#FDE4E6]',
        titleColor: 'text-[#FF4800]',
        priceColor: 'text-[#FF4800]',
        subtitleColor: 'text-[#FF4800]/70',
        dividerColor: 'border-[#FF4800]/20',
        textColor: 'text-[#1E1B3A]',
        buttonBg: 'bg-[#FF1E00] hover:bg-[#E01A00] text-white',
        features: [
            { name: 'Live Classes', value: '3/Week', iconBg: 'bg-purple-100 text-purple-600', icon: '🎥' },
            { name: 'Homework Help', value: 'check', iconBg: 'bg-pink-100 text-pink-600', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', iconBg: 'bg-green-100 text-green-600', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', iconBg: 'bg-blue-100 text-blue-600', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'cross', iconBg: 'bg-amber-100 text-amber-600', icon: '👤' },
        ],
    },
    {
        name: 'Standard',
        price: '₦45,000',
        subtitle: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
        cardBg: 'bg-[#3F114C]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-purple-200/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#3F114C]',
        features: [
            { name: 'Live Classes', value: '1/Week', iconBg: 'bg-purple-800 text-purple-200', icon: '🎥' },
            { name: 'Homework Help', value: 'check', iconBg: 'bg-pink-800 text-pink-200', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', iconBg: 'bg-green-800 text-green-200', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', iconBg: 'bg-blue-800 text-blue-200', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'cross', iconBg: 'bg-amber-800 text-amber-200', icon: '👤' },
        ],
    },
    {
        name: 'Premium',
        price: '₦70,000',
        subtitle: 'Lorem Ipsum Dolor Sit Amet Consectetur.',
        cardBg: 'bg-[#FF4800]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-orange-100/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#FF4800]',
        features: [
            { name: 'Live Classes', value: '3/Week', iconBg: 'bg-orange-600 text-white', icon: '🎥' },
            { name: 'Homework Help', value: 'check', iconBg: 'bg-orange-600 text-white', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', iconBg: 'bg-orange-600 text-white', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', iconBg: 'bg-orange-600 text-white', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'check', iconBg: 'bg-orange-600 text-white', icon: '👤' },
        ],
    },
];

export function Pricing() {
    const [billingCycle, setBillingCycle] = useState('Monthly');

    return (
        <section className="relative w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">

            {/* Header Section */}
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-comic text-[#FF4800] leading-tight mb-3">
                    Our Subscription Options
                </h2>
                <p className="text-gray-500 font-light text-sm sm:text-base md:text-lg font-comic">
                    Lorem Ipsum Dolor Sit Amet Consectetur. Lectus
                </p>
            </div>

            {/* 3 Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {PRICING_PLANS.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        whileHover={{ y: -8 }}
                        className={`${plan.cardBg} rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative border border-black/5`}
                    >
                        {/* Top Header Box */}
                        <div>
                            <h3 className={`text-2xl sm:text-3xl font-comic font-normal ${plan.titleColor} mb-3`}>
                                {plan.name}
                            </h3>

                            {/* Price & Billing Cycle Pill */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className={`text-3xl sm:text-4xl md:text-4xl font-black font-comic tracking-tight ${plan.priceColor}`}>
                                    {plan.price}
                                </span>

                                {/* Dropdown Pill */}
                                <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-1.5 cursor-pointer">
                                    <span className="text-xs sm:text-sm font-comic font-medium text-gray-800">
                                        {billingCycle}
                                    </span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-gray-600">
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Subtitle */}
                            <p className={`text-[11px] sm:text-xs font-light mb-6 ${plan.subtitleColor}`}>
                                {plan.subtitle}
                            </p>

                            {/* Divider Line */}
                            <div className={`w-full border-t ${plan.dividerColor} mb-6`} />

                            {/* Features List */}
                            <div className="space-y-4">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center justify-between text-xs sm:text-sm">

                                        {/* Icon + Feature Name */}
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs ${feature.iconBg}`}>
                                                {feature.icon}
                                            </div>
                                            <span className={`font-comic font-light text-xs sm:text-sm ${plan.textColor}`}>
                                                {feature.name}
                                            </span>
                                        </div>

                                        {/* Feature Value / Check / Cross */}
                                        <div>
                                            {feature.value === 'check' ? (
                                                <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center text-white text-[10px] font-bold">
                                                    ✓
                                                </div>
                                            ) : feature.value === 'cross' ? (
                                                <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center text-white text-[10px] font-bold">
                                                    ✕
                                                </div>
                                            ) : (
                                                <span className={`font-comic font-light text-xs sm:text-sm ${plan.textColor}`}>
                                                    {feature.value}
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Subscribe Button */}
                        <div className="mt-8 pt-4">
                            <button className={`w-full py-3.5 px-6 rounded-2xl font-comic text-base sm:text-lg font-normal transition-all shadow-md active:scale-95 ${plan.buttonBg}`}>
                                Subscribe
                            </button>
                        </div>

                    </motion.div>
                ))}
            </div>

        </section>
    );
}
