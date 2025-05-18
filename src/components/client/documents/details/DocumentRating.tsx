"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "../../../ui/button";

interface DocumentRatingProps {
    documentId: string;
    userRating?: number;
    averageRating?: number;
    totalRatings?: number;
    onRatingSubmit?: (rating: number) => void;
}

export default function DocumentRating({
    documentId,
    userRating = 0,
    averageRating = 0,
    totalRatings = 0,
    onRatingSubmit
}: DocumentRatingProps) {
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [selectedRating, setSelectedRating] = useState<number>(userRating);
    const [hasRated, setHasRated] = useState<boolean>(userRating > 0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showThankYou, setShowThankYou] = useState<boolean>(false);

    // Khôi phục đánh giá người dùng từ localStorage khi load component
    useEffect(() => {
        const savedRating = localStorage.getItem(`document-rating-${documentId}`);
        if (savedRating) {
            setSelectedRating(parseInt(savedRating));
            setHasRated(true);
        }
    }, [documentId]);

    const handleRatingHover = (rating: number) => {
        if (!hasRated) {
            setHoveredRating(rating);
        }
    };

    const handleRatingLeave = () => {
        setHoveredRating(0);
    };

    const handleRatingClick = (rating: number) => {
        if (!hasRated && !isSubmitting) {
            setSelectedRating(rating);
        }
    };

    const submitRating = async () => {
        if (selectedRating === 0 || hasRated || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Trong môi trường thực tế, đây sẽ là call API
            await new Promise(resolve => setTimeout(resolve, 500));

            // Lưu đánh giá vào localStorage
            localStorage.setItem(`document-rating-${documentId}`, selectedRating.toString());

            // Gọi callback nếu có
            if (onRatingSubmit) {
                onRatingSubmit(selectedRating);
            }

            setHasRated(true);
            setShowThankYou(true);

            // Ẩn thông báo sau 3 giây
            setTimeout(() => {
                setShowThankYou(false);
            }, 3000);

        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRatingText = (rating: number): string => {
        switch (rating) {
            case 1: return "Không hài lòng";
            case 2: return "Tạm được";
            case 3: return "Bình thường";
            case 4: return "Hài lòng";
            case 5: return "Rất hài lòng";
            default: return "Chưa đánh giá";
        }
    };

    const renderStars = (count: number, filled: boolean = false, interactive: boolean = false) => {
        return Array.from({ length: 5 }, (_, i) => {
            const starRating = i + 1;
            const isActive = interactive
                ? (hoveredRating > 0 ? starRating <= hoveredRating : starRating <= selectedRating)
                : starRating <= count;

            return (
                <Star
                    key={i}
                    className={`h-6 w-6 ${isActive
                            ? "fill-yellow-400 text-yellow-400"
                            : filled
                                ? "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                                : "text-gray-300 dark:text-gray-600"
                        } transition-colors ${interactive && !hasRated ? "cursor-pointer" : ""
                        }`}
                    onMouseEnter={interactive ? () => handleRatingHover(starRating) : undefined}
                    onMouseLeave={interactive ? handleRatingLeave : undefined}
                    onClick={interactive ? () => handleRatingClick(starRating) : undefined}
                />
            );
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Đánh giá tài liệu</h3>

            {/* Hiển thị đánh giá trung bình và tổng số đánh giá */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                    {renderStars(averageRating, true)}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    ({totalRatings} đánh giá)
                </div>
            </div>

            {/* Phần người dùng đánh giá */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="mb-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {hasRated ? "Đánh giá của bạn:" : "Chia sẻ đánh giá của bạn về tài liệu này:"}
                </p>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                            {renderStars(selectedRating, false, true)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedRating > 0 ? getRatingText(selectedRating) : "Chọn đánh giá"}
                        </span>
                    </div>

                    {!hasRated && (
                        <Button
                            onClick={submitRating}
                            disabled={selectedRating === 0 || isSubmitting}
                            className="w-fit mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            size="sm"
                        >
                            {isSubmitting ? (
                                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Đang gửi...</>
                            ) : (
                                'Gửi đánh giá'
                            )}
                        </Button>
                    )}
                </div>

                {showThankYou && (
                    <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm rounded-md border border-green-200 dark:border-green-800">
                        Cảm ơn bạn đã đánh giá tài liệu này!
                    </div>
                )}
            </div>
        </div>
    );
}
