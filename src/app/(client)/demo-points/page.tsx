"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function UserPointsDemoPage() {
    const [userPoints, setUserPoints] = useState<number>(0);
    // test thử 1 trường hợp khác là 10 điểm
    // const [userPoints, setUserPoints] = useState<number>(10);

    useEffect(() => {
        // Load user points from localStorage on component mount
        const storedPoints = parseInt(localStorage.getItem('userPoints') || '0');
        setUserPoints(storedPoints);
    }, []);

    const addPoints = (amount: number) => {
        const newPoints = userPoints + amount;
        setUserPoints(newPoints);
        localStorage.setItem('userPoints', newPoints.toString());
    };

    const toggleLoginStatus = () => {
        const currentStatus = localStorage.getItem('isLoggedIn') === 'true';
        localStorage.setItem('isLoggedIn', (!currentStatus).toString());

        // Reload to update UI
        window.location.reload();
    };

    const isLoggedIn = typeof window !== 'undefined' ?
        localStorage.getItem('isLoggedIn') === 'true' : false;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold mb-6 text-center">Quản lý điểm người dùng (Demo)</h1>

                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 text-indigo-800 p-6 rounded-xl text-center">
                        <p className="text-lg font-medium mb-1">Số điểm hiện tại</p>
                        <p className="text-3xl font-bold">{userPoints}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center mb-8">
                    <p className="text-gray-600">Thêm điểm để tải xuống tài liệu premium:</p>
                    <div className="flex gap-4">
                        <Button onClick={() => addPoints(10)} className="bg-green-600 hover:bg-green-700">
                            +10 điểm
                        </Button>
                        <Button onClick={() => addPoints(50)} className="bg-green-600 hover:bg-green-700">
                            +50 điểm
                        </Button>
                        <Button onClick={() => addPoints(100)} className="bg-green-600 hover:bg-green-700">
                            +100 điểm
                        </Button>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                    <p className="text-sm text-center text-gray-600 mb-4">Trạng thái đăng nhập (Demo)</p>
                    <div className="flex justify-center">
                        <Button onClick={toggleLoginStatus} className={isLoggedIn ? "text-white bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}>
                            {isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
                        </Button>
                    </div>
                    <p className="text-sm text-center mt-4">
                        Trạng thái hiện tại:
                        <span className={isLoggedIn ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                            {isLoggedIn ? " Đã đăng nhập" : " Chưa đăng nhập"}
                        </span>
                    </p>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-center text-gray-600 mb-4">Hướng dẫn thử nghiệm</p>
                    <ul className="space-y-2 text-sm">
                        <li>1. Sử dụng nút "Đăng nhập" để mô phỏng trạng thái đăng nhập</li>
                        <li>2. Thêm điểm để có thể tải xuống tài liệu premium</li>
                        <li>3. Chuyển đến trang chi tiết của một tài liệu premium để thử tải xuống</li>
                        <li>4. Điểm sẽ tự động bị trừ khi tải xuống tài liệu premium</li>
                        <li>5. Bạn có thể đăng xuất để xem thông báo yêu cầu đăng nhập khi muốn tải tài liệu premium</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
