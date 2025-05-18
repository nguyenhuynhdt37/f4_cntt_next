export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <div className="h-9 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="mt-2 h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

                    {/* Package Selection Skeleton */}
                    <div className="mb-8">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-4 border-gray-200">
                                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Amount Skeleton */}
                    <div className="mb-8">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Payment Methods Skeleton */}
                    <div className="mb-8">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="border rounded-lg p-4 border-gray-200">
                                    <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Skeleton */}
                    <div className="bg-gray-50 p-4 rounded-md mb-8">
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between py-2">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
