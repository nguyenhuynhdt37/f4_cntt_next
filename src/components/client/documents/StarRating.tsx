"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
    rating: number;
    size?: "sm" | "md" | "lg";
    showText?: boolean;
    totalRatings?: number;
}

export default function StarRating({
    rating,
    size = "md",
    showText = false,
    totalRatings
}: StarRatingProps) {
    // Calculate the full and partial stars
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

    // Determine star size based on the prop
    const starSize = {
        "sm": "h-3 w-3",
        "md": "h-4 w-4",
        "lg": "h-5 w-5"
    }[size];

    // Determine text size
    const textSize = {
        "sm": "text-xs",
        "md": "text-sm",
        "lg": "text-base"
    }[size];

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {/* Render full stars */}
                {Array(fullStars).fill(0).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        className={`${starSize} fill-yellow-400 text-yellow-400`}
                    />
                ))}

                {/* Render partial star if exists */}
                {partialStar > 0 && (
                    <span className="relative">
                        {/* Empty star as background */}
                        <Star className={`${starSize} text-gray-300 dark:text-gray-600`} />

                        {/* Partially filled star overlay */}
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
                            <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
                        </span>
                    </span>
                )}

                {/* Render empty stars */}
                {Array(emptyStars).fill(0).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className={`${starSize} text-gray-300 dark:text-gray-600`}
                    />
                ))}
            </div>

            {showText && (
                <div className={`flex items-center ${textSize} text-gray-600 dark:text-gray-400`}>
                    <span className="font-medium text-gray-700 dark:text-gray-300 mr-1">
                        {rating.toFixed(1)}
                    </span>
                    {totalRatings !== undefined && (
                        <span className="text-gray-500">
                            ({totalRatings})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
