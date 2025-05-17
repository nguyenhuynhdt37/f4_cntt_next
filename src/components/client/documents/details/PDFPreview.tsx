"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Lock, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "../../../ui/button";

// Thiết lập worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFPreviewProps {
  pdfUrl: string;
  previewPages: number; // Số trang cho xem trước
  totalPages?: number; // Tổng số trang của tài liệu
  documentId: string; // ID của tài liệu để theo dõi lượt tải
}

export default function PDFPreview({ pdfUrl, previewPages, totalPages = 0, documentId }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function changePage(offset: number) {
    const newPageNumber = pageNumber + offset;
    
    if (newPageNumber >= 1 && newPageNumber <= previewPages) {
      setPageNumber(newPageNumber);
    }
  }
  
  function zoomIn() {
    if (scale < 2.0) {
      setScale(scale + 0.1);
    }
  }
  
  function zoomOut() {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  }
  
  function rotate() {
    setRotation((rotation + 90) % 360);
  }
  
  async function downloadPDF() {
    setIsDownloading(true);
    try {
      // Giả lập API gọi để tăng lượt tải xuống
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tải xuống PDF
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch (err) {
      console.error("Failed to download:", err);
      setError("Không thể tải xuống tài liệu. Vui lòng thử lại sau.");
      setIsDownloading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="font-semibold text-lg">Xem trước tài liệu</h2>
        
        <div className="w-full sm:w-auto flex flex-wrap gap-2 items-center">
          <div className="flex border rounded-md p-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={zoomOut} 
              className="h-8 w-8 p-0"
              title="Thu nhỏ"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="inline-flex items-center px-2 text-sm">{Math.round(scale * 100)}%</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={zoomIn} 
              className="h-8 w-8 p-0"
              title="Phóng to"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={rotate} 
            className="h-8 w-8 p-0"
            title="Xoay trang"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <div className="flex ml-auto sm:ml-0">
            <span className="inline-flex items-center mr-2 text-sm">Trang {pageNumber} / {previewPages}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => changePage(-1)} 
              disabled={pageNumber <= 1}
              className="rounded-r-none border-r-0 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => changePage(1)} 
              disabled={pageNumber >= previewPages}
              className="rounded-l-none h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center p-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md mb-4 w-full max-w-2xl text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        
        <div className="text-sm mb-4 relative w-full max-w-2xl overflow-x-auto flex justify-center">
          <div className={`${isLoading ? 'block' : 'hidden'} absolute inset-0 flex justify-center items-center bg-white dark:bg-gray-800 z-10`}>
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="text-lg flex justify-center"
            onLoadError={(error) => {
              console.error("Error loading PDF:", error);
              setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
              setIsLoading(false);
            }}
          >            <Page 
              pageNumber={pageNumber} 
              width={540 * scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg text-sm"
              rotate={rotation}
              loading={
                <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              }
            />
          </Document>
          
          {pageNumber === previewPages && totalPages > previewPages && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-20">
              <Lock className="h-16 w-16 mb-4 text-white" />
              <p className="text-xl font-bold mb-2">Nội dung bị khóa</p>
              <p className="max-w-md text-center mb-4 px-4">Tải xuống để xem toàn bộ {totalPages} trang của tài liệu này</p>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                onClick={downloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span> Đang tải...</>
                ) : (
                  <><Download className="h-4 w-4 mr-1" /> Tải xuống ngay</>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {numPages && numPages > previewPages && (
          <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4 max-w-2xl w-full border border-blue-100 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-center">
              <Lock className="h-4 w-4 mr-2 text-blue-500" />
              Bạn chỉ có thể xem {previewPages} trang đầu tiên trên tổng số {numPages || totalPages} trang
            </p>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></span> Đang tải...</>
              ) : (
                <><Download className="h-4 w-4 mr-1" /> Tải xuống để xem toàn bộ</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
