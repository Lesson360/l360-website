'use client';

import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { X } from 'lucide-react';
import { evaluateExpression } from '@/lib/practice-exam/cbt';

const KEYS = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '(', ')', 'C', '⌫', '√', '+', '%', 'x²', 'Ans', '='];

export interface CbtCalculatorHandle {
    press: (key: string) => void;
}

interface CbtCalculatorProps {
    onClose: () => void;
}

// On-screen calculator, mirroring the basic one the CBT centre provides.
export const CbtCalculator = forwardRef<CbtCalculatorHandle, CbtCalculatorProps>(function CbtCalculator(
    { onClose },
    ref
) {
    const [expr, setExpr] = useState('');
    const [history, setHistory] = useState('');
    const [display, setDisplay] = useState('0');
    const [lastAnswer, setLastAnswer] = useState(0);

    const evaluate = (source: string) => evaluateExpression(source.replace(/Ans/g, `(${lastAnswer})`));

    const press = (key: string) => {
        if (key === 'C') {
            setExpr('');
            setHistory('');
            setDisplay('0');
            return;
        }
        if (key === '⌫') {
            const next = expr.endsWith('Ans') ? expr.slice(0, -3) : expr.slice(0, -1);
            setExpr(next);
            setDisplay(next || '0');
            return;
        }
        if (key === '=') {
            const value = evaluate(expr);
            setHistory(`${expr} =`);
            if (value === null) {
                // Start fresh on the next key instead of appending to a broken expression.
                setExpr('');
                setDisplay('Error');
                return;
            }
            setLastAnswer(value);
            setExpr(String(value));
            setDisplay(String(value));
            return;
        }
        if (key === '√' || key === 'x²' || key === '%') {
            const value = evaluate(expr);
            if (value === null) return;
            const result = key === '√' ? Math.sqrt(value) : key === 'x²' ? value * value : value / 100;
            if (!isFinite(result)) {
                setDisplay('Error');
                return;
            }
            const rounded = parseFloat(result.toPrecision(12));
            setHistory(key === '√' ? `√(${expr})` : key === 'x²' ? `(${expr})²` : `${expr}%`);
            setLastAnswer(rounded);
            setExpr(String(rounded));
            setDisplay(String(rounded));
            return;
        }
        const next = expr + key;
        setExpr(next);
        setDisplay(next);
    };

    useImperativeHandle(ref, () => ({ press }));

    return (
        <div
            role="dialog"
            aria-label="Calculator"
            className="fixed right-4 bottom-4 z-40 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl p-3"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700">Calculator</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close calculator"
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="font-mono text-right px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl min-h-[56px] break-all">
                <span className="block text-[11px] text-gray-400 min-h-[16px]">{history}</span>
                <span className="text-lg font-semibold text-gray-900">{display}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
                {KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => press(key)}
                        className={`py-2 rounded-lg font-mono text-sm font-semibold border transition-colors ${key === '='
                            ? 'bg-[#FF4801] border-[#FF4801] text-white hover:bg-[#e03f00]'
                            : key === 'C'
                                ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100'
                                : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
                            }`}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </div>
    );
});
