"use client";

import { useState, useEffect } from "react";
import { User, Send, MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";

interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
  replies?: Reply[];
}

interface DocumentCommentsProps {
  documentId: string;
}

export default function DocumentComments({ documentId }: DocumentCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [visibleComments, setVisibleComments] = useState<number>(3);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    // Giả lập việc tải bình luận từ API
    const loadComments = async () => {
      setIsLoading(true);
      try {
        // Trong thực tế, bạn sẽ gọi API để lấy bình luận
        await new Promise(resolve => setTimeout(resolve, 800));
          const mockComments: Comment[] = [
          {
            id: "1",
            userId: "user1",
            userName: "Nguyễn Văn A",
            userAvatar: "/images/avatars/avatar1.jpg",
            content: "Tài liệu rất chi tiết và dễ hiểu. Đặc biệt là phần về đa hình và kế thừa được trình bày rất rõ ràng.",
            createdAt: "2024-04-12T10:30:00Z",
            likesCount: 5,
            liked: false,
            replies: [
              {
                id: "reply-1-1",
                userId: "user4",
                userName: "Phan Thị D",
                userAvatar: "/images/avatars/avatar4.jpg",
                content: "Tôi cũng thấy phần đa hình rất dễ hiểu. Bạn có thể chia sẻ thêm về các ví dụ thực tế không?",
                createdAt: "2024-04-12T14:20:00Z",
                likesCount: 2,
                liked: true
              }
            ]
          },
          {
            id: "2",
            userId: "user2",
            userName: "Trần Thị B",
            userAvatar: "/images/avatars/avatar2.jpg",
            content: "Tôi thấy một số ví dụ trong phần Lớp và Đối tượng còn hơi khó hiểu. Có thể bổ sung thêm giải thích chi tiết hơn không?",
            createdAt: "2024-04-15T14:45:00Z",
            likesCount: 2,
            liked: true,
            replies: []
          },          {
            id: "3",
            userId: "user3",
            userName: "Lê Văn C",
            content: "Cảm ơn tác giả đã chia sẻ tài liệu hữu ích. Tôi đã học được nhiều kiến thức mới.",
            createdAt: "2024-04-18T09:15:00Z",
            likesCount: 8,
            liked: false,
            replies: []
          },
          {
            id: "4",
            userId: "user5",
            userName: "Hoàng Thị E",
            userAvatar: "/images/avatars/avatar5.jpg",
            content: "Phần ví dụ về Template trong C++ rất hay, nhưng tôi nghĩ cần có thêm bài tập thực hành để hiểu sâu hơn.",
            createdAt: "2024-04-19T11:25:00Z",
            likesCount: 3,
            liked: false,
            replies: []
          },
          {
            id: "5",
            userId: "user6",
            userName: "Ngô Văn F",
            content: "Tài liệu này đã giúp tôi vượt qua kỳ thi cuối kỳ môn OOP. Rất cám ơn tác giả!",
            createdAt: "2024-04-20T15:40:00Z",
            likesCount: 12,
            liked: true,
            replies: []
          },
          {
            id: "6",
            userId: "user7",
            userName: "Lý Thị G",
            userAvatar: "/images/avatars/avatar7.jpg",
            content: "Tôi là giảng viên dạy OOP và thường khuyên sinh viên tham khảo tài liệu này. Nội dung rất chi tiết và cập nhật.",
            createdAt: "2024-04-21T08:50:00Z",
            likesCount: 15,
            liked: false,
            replies: [
              {
                id: "reply-6-1",
                userId: "user8",
                userName: "Trần Văn H",
                content: "Em là sinh viên của cô. Em cũng thấy tài liệu này rất hữu ích. Cảm ơn cô đã giới thiệu!",
                createdAt: "2024-04-21T10:15:00Z",
                likesCount: 3,
                liked: false
              }
            ]
          }
        ];
        
        setComments(mockComments);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
  }, [documentId]);
    const handlePostComment = async () => {
    if (!newComment.trim()) return;
    
    setIsPostingComment(true);
    try {
      // Giả lập việc gửi bình luận tới API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Tạo bình luận mới
      const newCommentObj: Comment = {
        id: `temp-${Date.now()}`,
        userId: "current-user",  // Trong thực tế, lấy từ thông tin người dùng đăng nhập
        userName: "Bạn",
        content: newComment,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        liked: false,
        replies: []
      };
      
      // Thêm bình luận mới vào danh sách
      setComments(prevComments => [newCommentObj, ...prevComments]);
      setNewComment("");
      
      // Đảm bảo bình luận mới được hiển thị
      setVisibleComments(prev => Math.max(prev, 1));
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Không thể đăng bình luận. Vui lòng thử lại sau.");
    } finally {
      setIsPostingComment(false);
    }
  };
    const handleLikeComment = async (commentId: string, isReply = false, parentCommentId?: string) => {
    try {
      // Giả lập việc gửi yêu cầu thích bình luận tới API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Cập nhật UI
      if (!isReply) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              const wasLiked = comment.liked;
              return {
                ...comment,
                likesCount: wasLiked ? comment.likesCount - 1 : comment.likesCount + 1,
                liked: !wasLiked
              };
            }
            return comment;
          })
        );
      } else if (parentCommentId) {
        // Cập nhật like cho phản hồi
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: comment.replies?.map(reply => {
                  if (reply.id === commentId) {
                    const wasLiked = reply.liked;
                    return {
                      ...reply,
                      likesCount: wasLiked ? reply.likesCount - 1 : reply.likesCount + 1,
                      liked: !wasLiked
                    };
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReplyToComment = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const submitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;
    
    try {
      // Giả lập việc gửi phản hồi tới API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReply: Reply = {
        id: `reply-${commentId}-${Date.now()}`,
        userId: "current-user", // Trong thực tế, lấy từ thông tin đăng nhập
        userName: "Bạn",
        content: replyContent,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        liked: false
      };
      
      // Cập nhật UI
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply]
            };
          }
          return comment;
        })
      );
      
      // Reset form
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
        <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
        Bình luận ({comments.length})
      </h2>
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-grow">            <Textarea
              placeholder="Chia sẻ ý kiến của bạn về tài liệu này..."
              value={newComment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment(e.target.value)}
              className="w-full mb-2 min-h-24 resize-y"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handlePostComment}
                disabled={isPostingComment || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isPostingComment ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Gửi bình luận
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
        <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.slice(0, visibleComments).map(comment => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
              <div className="flex space-x-4">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                  {comment.userAvatar ? (
                    <img 
                      src={comment.userAvatar} 
                      alt={comment.userName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.userName}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>                  <div className="flex items-center">
                    <button 
                      className={`flex items-center text-sm ${comment.liked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{comment.likesCount} Thích</span>
                    </button>
                    <button 
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-4"
                      onClick={() => handleReplyToComment(comment.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>Phản hồi</span>
                    </button>
                  </div>
                  
                  {/* Form phản hồi */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                      <Textarea 
                        placeholder="Viết phản hồi của bạn..."
                        value={replyContent}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyContent(e.target.value)}
                        className="w-full mb-2 min-h-20 resize-y text-sm"
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => submitReply(comment.id)}
                          disabled={!replyContent.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1"
                        >
                          Gửi phản hồi
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelReply}
                          className="text-xs py-1"
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Hiển thị các phản hồi */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-gray-100 dark:border-gray-700 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="pb-2">
                          <div className="flex space-x-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                              {reply.userAvatar ? (
                                <img 
                                  src={reply.userAvatar} 
                                  alt={reply.userName}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                  {reply.userName}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                {reply.content}
                              </p>
                              <button 
                                className={`flex items-center text-xs ${reply.liked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors`}
                                onClick={() => handleLikeComment(reply.id, true, comment.id)}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span>{reply.likesCount} Thích</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>Chưa có bình luận nào cho tài liệu này.</p>
            <p className="mt-1">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
          </div>
        )}
      </div>
        {comments.length > visibleComments && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setVisibleComments(prev => prev + 3)}
          >
            Xem thêm bình luận
          </Button>
        </div>
      )}
    </div>
  );
}
