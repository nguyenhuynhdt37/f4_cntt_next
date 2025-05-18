'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock createDeposit
const createDeposit = async (depositData: any): Promise<any> => {
    console.log('Mock createDeposit được gọi với:', depositData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (depositData.amount >= 10000) {
        return { success: true, message: "Khởi tạo giao dịch thành công", transactionId: `mock_txn_${Date.now()}` };
    }
    return Promise.reject(new Error("Số tiền không hợp lệ hoặc lỗi giả lập từ máy chủ."));
};

interface PaymentPackage {
    id: number;
    name: string;
    amount: number;
    points: number;
    description?: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    // icon?: JSX.Element;
    isAvailable: boolean;
}

// Refined SVG Icons
const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21V3.75h7.5V21h-7.5zM12 16.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
);

const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6.042A2.253 2.253 0 0118.75 20.25H5.25A2.253 2.253 0 013 18.042V12m18 0V9.75A2.25 2.25 0 0018.75 7.5H5.25A2.25 2.25 0 003 9.75V12M15 13.5H9" />
    </svg>
);

export default function FormNapTienTinhTe() {
    const router = useRouter();

    const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('bank_transfer');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const paymentPackages: PaymentPackage[] = [
        { id: 1, name: 'Gói Cơ Bản', amount: 50000, points: 50, description: 'Khởi đầu nhanh chóng, tiết kiệm.' },
        { id: 2, name: 'Gói Ưa Chuộng', amount: 100000, points: 110, description: 'Lựa chọn phổ biến, nhiều ưu đãi.' },
        { id: 3, name: 'Gói Cao Cấp', amount: 200000, points: 240, description: 'Giá trị tối ưu, trải nghiệm vượt trội.' },
        { id: 4, name: 'Gói Chuyên Gia', amount: 500000, points: 650, description: 'Dành cho người dùng chuyên nghiệp.' },
    ];

    const paymentMethods: PaymentMethod[] = [
        { id: 'bank_transfer', name: 'Chuyển Khoản', isAvailable: true },
        { id: 'cash', name: 'Tiền Mặt', isAvailable: false }, // Example: cash might be unavailable
        { id: 'wallet', name: 'Ví Điện Tử', isAvailable: true },
    ];

    const handlePackageSelect = (pkg: PaymentPackage) => {
        setSelectedPackage(pkg);
        setCustomAmount('');
        setError('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setCustomAmount(value);
            setSelectedPackage(null);
            if (value !== '' && parseInt(value) < 10000) {
                setError('Số tiền nạp tối thiểu là 10,000 VNĐ.');
            } else if (error === 'Số tiền nạp tối thiểu là 10,000 VNĐ.') {
                setError('');
            }
        }
    };

    const handlePaymentMethodSelect = (methodId: string) => {
        const method = paymentMethods.find(m => m.id === methodId);
        if (method && method.isAvailable) {
            setSelectedPaymentMethod(methodId);
            setError('');
        }
    };

    const currentDepositAmount = selectedPackage ? selectedPackage.amount : customAmount ? parseInt(customAmount) : 0;
    const currentPointsToReceive = selectedPackage
        ? selectedPackage.points
        : customAmount
            ? (parseInt(customAmount) >= 10000 ? Math.floor(parseInt(customAmount) / 1000) : 0)
            : 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (currentDepositAmount < 10000) {
            setError('Số tiền nạp tối thiểu là 10,000 VNĐ.');
            return;
        }
        if (!selectedPaymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán.');
            return;
        }

        const depositData = {
            amount: currentDepositAmount,
            paymentMethod: selectedPaymentMethod,
            packageId: selectedPackage?.id,
            redirectUrl: `${window.location.origin}/lich-su-giao-dich`
        };

        try {
            setIsLoading(true);
            await createDeposit(depositData);
            router.push(`/payment-mock?amount=${currentDepositAmount}&method=${selectedPaymentMethod}&status=success&package=${selectedPackage?.name || 'Custom'}`);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi xử lý giao dịch của bạn. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-6 px-2 sm:px-6 lg:px-12 xl:px-24">
            <div className="bg-white rounded-none sm:rounded-lg shadow-none sm:shadow-lg p-4 sm:p-8 w-full max-w-full sm:max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Nạp Tiền vào Tài Khoản
                    </h1>
                    <p className="text-sm text-gray-500 mt-1.5">
                        Chọn gói hoặc nhập số tiền bạn muốn nạp.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-md relative" role="alert">
                        <strong className="font-semibold">Lỗi: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Gói nạp */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-700 mb-3">1. Chọn Gói Nạp</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {paymentPackages.map((pkg) => {
                                const isSelected = selectedPackage?.id === pkg.id;

                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => handlePackageSelect(pkg)}
                                        className={`relative group cursor-pointer border rounded-2xl p-5 transition-all duration-300 ease-in-out transform 
          ${isSelected
                                                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-white shadow-xl ring-2 ring-blue-500 scale-[1.02]'
                                                : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.01] bg-white'
                                            }`}
                                    >
                                        {/* Ribbon "Phổ biến" cho gói thứ 2 */}
                                        {pkg.id === 2 && (
                                            <div className="absolute -right-10 top-5 transform rotate-45 bg-blue-600 text-white text-xs font-semibold py-1 px-10 shadow-md">
                                                Phổ biến
                                            </div>
                                        )}

                                        {/* Dấu chọn nếu selected */}
                                        {isSelected && (
                                            <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow">
                                                ✅
                                            </div>
                                        )}

                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                            {pkg.name}
                                        </h3>

                                        <p className="text-xl text-blue-600 font-extrabold my-2">
                                            {formatCurrency(pkg.amount)}
                                        </p>

                                        <p className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded inline-block">
                                            🎁 +{pkg.points} điểm thưởng
                                        </p>

                                        {pkg.description && (
                                            <p className="text-sm text-gray-500 mt-3">{pkg.description}</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </section>

                    {/* Nhập số tiền tùy chỉnh */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-700 mb-1.5">Hoặc Nhập Số Tiền Khác</h2>
                        <p className="text-xs text-gray-500 mb-2.5">Tối thiểu: {formatCurrency(10000)}</p>
                        <div className="relative max-w-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-sm">₫</span>
                            </div>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                className="block w-full text-sm rounded-md border-gray-300 pl-7 pr-12 py-2.5 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                                placeholder="Ví dụ: 150000"
                                value={customAmount}
                                onChange={handleCustomAmountChange}
                                disabled={isLoading}
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-400 text-xs font-medium">VND</span>
                            </div>
                        </div>
                    </section>

                    {/* Phương thức thanh toán */}
                    <section>
                        <h2 className="text-lg font-medium text-gray-700 mb-3">2. Chọn Phương Thức</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => method.isAvailable && handlePaymentMethodSelect(method.id)}
                                    className={`group cursor-pointer border rounded-lg p-3 h-28 flex flex-col items-center justify-center text-center transition-all duration-200 ease-in-out
                  ${!method.isAvailable
                                            ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                            : 'hover:shadow-md bg-white'
                                        }
                  ${method.isAvailable && selectedPaymentMethod === method.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                        {method.name}
                                    </span>
                                    {!method.isAvailable && (
                                        <span className="text-xxs text-red-500 mt-0.5 font-medium">(Sắp có)</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Xác nhận */}
                    <section className="bg-gray-50 p-5 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-700 mb-3">3. Xác Nhận Thông Tin</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                                <span className="text-gray-600">Số tiền nạp:</span>
                                <span className="font-semibold text-blue-600">
                                    {currentDepositAmount > 0 ? formatCurrency(currentDepositAmount) : formatCurrency(0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-200">
                                <span className="text-gray-600">Điểm thưởng:</span>
                                <span className="font-semibold text-green-600">
                                    {currentPointsToReceive} điểm
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5">
                                <span className="text-gray-600">Thanh toán qua:</span>
                                <span className="font-semibold text-gray-700">
                                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'Chưa chọn'}
                                </span>
                            </div>
                        </div>
                    </section>

                    <div className="pt-3">
                        <button
                            type="submit"
                            disabled={isLoading || currentDepositAmount < 10000 || !selectedPaymentMethod}
                            className="w-full px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-1.5">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291..." />
                                    </svg>
                                    <span>Đang Xử Lý...</span>
                                </div>
                            ) : (
                                'Nạp Tiền Ngay'
                            )}
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-3">
                            Nhấn "Nạp Tiền Ngay" đồng nghĩa với việc bạn chấp nhận <a href="/dieu-khoan" className="text-blue-600 hover:underline">Điều khoản Dịch vụ</a>.
                        </p>
                    </div>
                </form>
            </div>

            {/* Footer nhỏ nếu cần */}
            <footer className="text-center mt-10">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} Tên Công Ty Của Bạn. Bảo lưu mọi quyền.</p>
            </footer>
        </div>
    );


}