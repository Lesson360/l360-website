'use client';

import React from 'react';
import { BookOpen, CheckCircle2, Loader2, Sparkles, ClipboardList } from 'lucide-react';
import { TestDrillerProductCatalogItem } from '@/lib/api/test-driller';

interface TestDrillerCatalogProps {
    activeTab: 'explore' | 'my-courses';
    onTabChange: (tab: 'explore' | 'my-courses') => void;
    products: TestDrillerProductCatalogItem[];
    purchasedProductIds: Set<string>;
    isLoading: boolean;
    isCheckingOutProductId: string | null;
    onSubscribe: (product: TestDrillerProductCatalogItem) => void;
    onPractice: (product: TestDrillerProductCatalogItem) => void;
}

function formatPrice(product: TestDrillerProductCatalogItem): string {
    if (typeof product.priceAmount !== 'number') return 'Contact Us';
    const currencySymbol = product.currency === 'USD' ? '$' : product.currency === 'GBP' ? '£' : '₦';
    return `${currencySymbol}${product.priceAmount.toLocaleString()}`;
}

function formatDuration(product: TestDrillerProductCatalogItem): string {
    if (product.durationMonths) return `${product.durationMonths} month${product.durationMonths > 1 ? 's' : ''}`;
    if (product.durationDays) {
        const months = Math.round(product.durationDays / 30);
        return months > 0 ? `${months} month${months > 1 ? 's' : ''}` : `${product.durationDays} days`;
    }
    return 'Lifetime Access';
}

export function TestDrillerCatalog({
    activeTab,
    onTabChange,
    products,
    purchasedProductIds,
    isLoading,
    isCheckingOutProductId,
    onSubscribe,
    onPractice
}: TestDrillerCatalogProps) {
    const purchased = products.filter((p) => purchasedProductIds.has(p.id || (p as any)._id));
    const notPurchased = products.filter((p) => !purchasedProductIds.has(p.id || (p as any)._id));
    const visibleProducts = activeTab === 'explore' ? notPurchased : purchased;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs bg-gradient-to-br from-[#4A154B] to-[#2D0C2E] text-white">
                <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="w-5 h-5 text-purple-200" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Test Drillers</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight">Explore All Exam Bundles</h1>
                <p className="text-sm text-purple-200/90 mt-1">Select exam body to explore past questions, timed papers, and full mock exams.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs w-fit">
                <button
                    type="button"
                    onClick={() => onTabChange('explore')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    New Combo
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange('my-courses')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'my-courses' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    My Courses
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                        <Loader2 className="w-4 h-4 text-[#FF4801] animate-spin" />
                        <span>
                            {activeTab === 'my-courses' ? 'Loading your purchased bundles...' : 'Loading available bundles...'}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-purple-100 bg-gradient-to-b from-[#F3E8FF] to-white p-6 space-y-4 animate-pulse"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-purple-200/70" />
                                <div className="space-y-2">
                                    <div className="h-4 w-2/3 rounded-full bg-purple-200/70" />
                                    <div className="h-3 w-full rounded-full bg-purple-100" />
                                    <div className="h-3 w-4/5 rounded-full bg-purple-100" />
                                </div>
                                <div className="h-5 w-1/3 rounded-full bg-purple-200/70" />
                                <div className="h-11 w-full rounded-xl bg-purple-200/70" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : visibleProducts.length === 0 ? (
                <div className="py-16 bg-white rounded-2xl border border-gray-200 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-700">
                        {activeTab === 'explore' ? 'You already own every available bundle.' : 'You have not purchased any Test Driller bundle yet.'}
                    </p>
                    {activeTab === 'my-courses' && (
                        <button
                            type="button"
                            onClick={() => onTabChange('explore')}
                            className="text-xs font-bold text-[#FF4801] hover:underline"
                        >
                            Browse available bundles
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleProducts.map((product) => {
                        const productId = product.id || (product as any)._id;
                        const isOwned = purchasedProductIds.has(productId);
                        const isCheckingOut = isCheckingOutProductId === productId;

                        return (
                            <div
                                key={productId}
                                className="rounded-3xl border border-purple-100 bg-gradient-to-b from-[#F3E8FF] to-white p-6 space-y-4 shadow-xs hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-11 h-11 rounded-2xl bg-[#4A154B] text-white flex items-center justify-center shadow-xs">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    {product.isMostPopular && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-[#FF4801] text-[10px] font-black uppercase">
                                            <Sparkles className="w-3 h-3" /> Most Popular
                                        </span>
                                    )}
                                    {isOwned && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{product.name || product.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {product.description || 'All subjects for ultra preparation.'}
                                    </p>
                                </div>

                                {!isOwned && (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-black text-gray-900">{formatPrice(product)}</span>
                                        <span className="text-[11px] font-semibold text-gray-400">/ {formatDuration(product)}</span>
                                    </div>
                                )}

                                {isOwned ? (
                                    <button
                                        type="button"
                                        onClick={() => onPractice(product)}
                                        className="w-full py-3 rounded-xl bg-[#FF4801] hover:bg-orange-600 text-white font-black text-xs shadow-md cursor-pointer"
                                    >
                                        Practice
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={isCheckingOut}
                                        onClick={() => onSubscribe(product)}
                                        className="w-full py-3 rounded-xl bg-[#4A154B] hover:bg-[#37103a] text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {isCheckingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span>Subscribe</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
