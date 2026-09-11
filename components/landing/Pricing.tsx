'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { subscriptionsApi, SubscriptionPlan, PlanDescriptionObject } from '@/lib/api/subscriptions';

const CARD_THEMES = [
    {
        cardBg: 'bg-[#FDE4E6]',
        titleColor: 'text-[#FF4800]',
        priceColor: 'text-[#FF4800]',
        subtitleColor: 'text-[#FF4800]/70',
        dividerColor: 'border-[#FF4800]/20',
        textColor: 'text-[#1E1B3A]',
        buttonBg: 'bg-[#FF1E00] hover:bg-[#E01A00] text-white',
        badgeBg: 'bg-[#FF4800] text-white',
        iconBg: 'bg-purple-100 text-purple-600',
    },
    {
        cardBg: 'bg-[#3F114C]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-purple-200/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#3F114C]',
        badgeBg: 'bg-purple-800 text-purple-100',
        iconBg: 'bg-purple-800 text-purple-200',
    },
    {
        cardBg: 'bg-[#FF4800]',
        titleColor: 'text-white',
        priceColor: 'text-white',
        subtitleColor: 'text-orange-100/80',
        dividerColor: 'border-white/20',
        textColor: 'text-white',
        buttonBg: 'bg-white hover:bg-gray-100 text-[#FF4800]',
        badgeBg: 'bg-white text-[#FF4800]',
        iconBg: 'bg-orange-600/90 text-white',
    },
];

const FALLBACK_PLANS: SubscriptionPlan[] = [
    {
        id: 'basic-plan',
        name: 'Basic',
        billingPeriod: 'monthly',
        priceAmount: 15000,
        currency: 'NGN',
        description: 'Standard monthly learning access for core subject modules & quizzes.',
        features: [
            { name: 'Live Classes', value: '3/Week', icon: '🎥' },
            { name: 'Homework Help', value: 'check', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'cross', icon: '👤' },
        ],
    },
    {
        id: 'standard-plan',
        name: 'Standard',
        billingPeriod: 'termly',
        priceAmount: 45000,
        currency: 'NGN',
        description: 'Complete termly academic package with full video library & worksheets.',
        features: [
            { name: 'Live Classes', value: '1/Week', icon: '🎥' },
            { name: 'Homework Help', value: 'check', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'cross', icon: '👤' },
        ],
    },
    {
        id: 'premium-plan',
        name: 'Premium',
        billingPeriod: 'school_year',
        priceAmount: 70000,
        currency: 'NGN',
        description: 'Full school year access with Test Driller CBT prep & 1-on-1 tutoring.',
        includesTestDriller: true,
        features: [
            { name: 'Live Classes', value: '3/Week', icon: '🎥' },
            { name: 'Homework Help', value: 'check', icon: '📝' },
            { name: 'Learning Resources', value: 'Standard', icon: '📚' },
            { name: 'Progress Tracking', value: 'check', icon: '📈' },
            { name: '1 - On - 1 Support', value: 'check', icon: '👤' },
        ],
    },
];

interface FeatureItem {
    name: string;
    value: 'check' | 'cross' | string;
    icon: string;
}

export function Pricing() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubscriptionPlans() {
            try {
                const response = await subscriptionsApi.getPlans({ status: 'active' }).catch(() => null);
                const rawData = response?.data;
                let items: SubscriptionPlan[] = [];

                if (Array.isArray(rawData)) {
                    items = rawData;
                } else if (Array.isArray((rawData as any)?.items)) {
                    items = (rawData as any).items;
                }

                if (items.length > 0) {
                    setPlans(items);
                } else {
                    setPlans(FALLBACK_PLANS);
                }
            } catch (err) {
                console.warn('Could not fetch subscription plans from API, fallback loaded:', err);
                setPlans(FALLBACK_PLANS);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscriptionPlans();
    }, []);

    const formatPrice = (plan: SubscriptionPlan) => {
        const amount = plan.priceAmount ?? plan.price ?? plan.monthlyPrice ?? 0;
        const currencySymbol = plan.currency === 'USD' ? '$' : '₦';
        return `${currencySymbol}${amount.toLocaleString()}`;
    };

    const formatBillingPeriod = (period?: string) => {
        if (!period) return 'Monthly';
        switch (period.toLowerCase()) {
            case 'monthly': return 'Monthly';
            case 'termly': return 'Termly';
            case 'school_year': return 'School Year';
            case 'yearly': return 'Yearly';
            default: return period.charAt(0).toUpperCase() + period.slice(1);
        }
    };

    const getPlanSubtitle = (plan: SubscriptionPlan): string => {
        if (typeof plan.description === 'string') {
            try {
                const parsed = JSON.parse(plan.description);
                if (parsed.textDescription) return parsed.textDescription;
            } catch {
                if (plan.description.trim()) return plan.description;
            }
        } else if (typeof plan.description === 'object' && plan.description?.textDescription) {
            return plan.description.textDescription;
        }
        return 'Access customized lessons, practice quizzes, and learning resources.';
    };

    const getPlanFeatures = (plan: SubscriptionPlan): FeatureItem[] => {
        if (Array.isArray(plan.features) && plan.features.length > 0) {
            return plan.features.map((f: any) => {
                if (typeof f === 'string') {
                    return { name: f, value: 'check', icon: '⭐' };
                }
                return {
                    name: f.name || f.title || 'Feature',
                    value: f.value || 'check',
                    icon: f.icon || '⭐',
                };
            });
        }

        // Parse features from description object if available
        let descObj: PlanDescriptionObject | null = null;
        if (typeof plan.description === 'string') {
            try { descObj = JSON.parse(plan.description); } catch { }
        } else if (typeof plan.description === 'object' && plan.description !== null) {
            descObj = plan.description;
        }

        const featuresList: FeatureItem[] = [
            {
                name: 'Live Interactive Classes',
                value: descObj?.videos !== false ? '3/Week' : 'cross',
                icon: '🎥',
            },
            {
                name: 'Homework & Assignment Help',
                value: descObj?.worksheets !== false ? 'check' : 'cross',
                icon: '📝',
            },
            {
                name: 'Learning Resources & Notes',
                value: descObj?.resources !== false ? 'Standard' : 'cross',
                icon: '📚',
            },
            {
                name: 'Progress Tracking Analytics',
                value: descObj?.quizzes !== false ? 'check' : 'cross',
                icon: '📈',
            },
            {
                name: 'Test Driller Exam Prep',
                value: plan.includesTestDriller ? 'check' : 'cross',
                icon: '👤',
            },
        ];

        return featuresList;
    };

    return (
        <section className="relative w-full bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">

            {/* Header Section */}
            <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-comic text-[#FF4800] leading-tight mb-3">
                    Our Subscription Options
                </h2>
                <p className="text-gray-500 font-light text-sm sm:text-base md:text-lg font-comic">
                    Flexible learning packages designed for every learner&apos;s academic journey
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#FF4800]" />
                    <p className="text-gray-500 font-medium text-sm font-comic">Loading subscription plans...</p>
                </div>
            ) : (
                /* 3 Cards Grid */
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {plans.map((plan, index) => {
                        const theme = CARD_THEMES[index % CARD_THEMES.length];
                        const planName = plan.name || plan.title || `Plan ${index + 1}`;
                        const features = getPlanFeatures(plan);
                        const subtitle = getPlanSubtitle(plan);
                        const planId = plan.id || plan._id || '';

                        return (
                            <motion.div
                                key={planId || planName}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                whileHover={{ y: -8 }}
                                className={`${theme.cardBg} rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-lg relative border border-black/5`}
                            >
                                {/* Top Header Box */}
                                <div>
                                    <h3 className={`text-2xl sm:text-3xl font-comic font-normal ${theme.titleColor} mb-3`}>
                                        {planName}
                                    </h3>

                                    {/* Price & Billing Cycle Pill */}
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`text-3xl sm:text-4xl md:text-4xl font-black font-comic tracking-tight ${theme.priceColor}`}>
                                            {formatPrice(plan)}
                                        </span>

                                        {/* Dropdown Pill */}
                                        <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-1.5">
                                            <span className="text-xs sm:text-sm font-comic font-medium text-gray-800">
                                                {formatBillingPeriod(plan.billingPeriod)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtitle */}
                                    <p className={`text-[11px] sm:text-xs font-light mb-6 ${theme.subtitleColor}`}>
                                        {subtitle}
                                    </p>

                                    {/* Divider Line */}
                                    <div className={`w-full border-t ${theme.dividerColor} mb-6`} />

                                    {/* Features List */}
                                    <div className="space-y-4">
                                        {features.map((feature, fIdx) => (
                                            <div key={fIdx} className="flex items-center justify-between text-xs sm:text-sm">

                                                {/* Icon + Feature Name */}
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs ${theme.iconBg}`}>
                                                        {feature.icon}
                                                    </div>
                                                    <span className={`font-comic font-light text-xs sm:text-sm ${theme.textColor}`}>
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
                                                        <span className={`font-comic font-light text-xs sm:text-sm ${theme.textColor}`}>
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
                                    <Link
                                        href={planId ? `/signup?planId=${planId}` : '/signup'}
                                        className={`block text-center w-full py-3.5 px-6 rounded-2xl font-comic text-base sm:text-lg font-normal transition-all shadow-md active:scale-95 ${theme.buttonBg}`}
                                    >
                                        Subscribe
                                    </Link>
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            )}

        </section>
    );
}

