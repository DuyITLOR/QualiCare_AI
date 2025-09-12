import React from "react"
import { 
  FaChevronDown, FaUser, FaPhone, FaSearch, 
  FaRegCommentDots, FaUsers, FaEye, FaClock, 
  FaThumbtack, FaStar 
} from "react-icons/fa"
import Header from '../Components/header'


const Forum = () => {
  const forumCategories = [
    {
      id: 1,
      title: "Kỹ thuật chăn nuôi cút",
      description: "Thảo luận về các kỹ thuật chăn nuôi, chăm sóc và quản lý đàn cút",
      posts: 245,
      topics: 67,
      lastPost: "2 giờ trước",
      lastUser: "Nguyễn Văn A",
      color: "#FFB22C",
    },
    {
      id: 2,
      title: "Công nghệ thông minh",
      description: "Chia sẻ về ứng dụng AI và IoT trong chăn nuôi cút",
      posts: 189,
      topics: 43,
      lastPost: "5 giờ trước",
      lastUser: "Trần Thị B",
      color: "#854836",
    },
  ]

  const recentPosts = [
    {
      id: 1,
      title: "Cách phòng chống bệnh Newcastle ở cút con",
      author: "Nguyễn Văn A",
      replies: 12,
      views: 234,
      time: "2 giờ trước",
      isPinned: true,
      category: "Kỹ thuật chăn nuôi cút",
    },
    {
      id: 2,
      title: "Ứng dụng cảm biến nhiệt độ tự động trong chuồng nuôi",
      author: "Trần Thị B",
      replies: 8,
      views: 156,
      time: "4 giờ trước",
      isPinned: false,
      category: "Công nghệ thông minh",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <header>
        <Header/>
      </header>

      {/* Search + Create Post */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6">
          <h2 className="text-2xl font-bold text-[#ffc130]">Diễn đàn QuailCare AI</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              />
            </div>
            <button className="bg-[#193701] text-white px-4 py-2 rounded-lg">Tạo bài viết</button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        <h3 className="flex items-center gap-2 text-xl font-bold text-[#ffc130] mb-4">
          <FaRegCommentDots /> Danh mục diễn đàn
        </h3>
        {forumCategories.map(cat => (
          <div key={cat.id} className="bg-white p-4 mb-4 rounded-lg shadow-sm flex justify-between">
            <div>
              <h4 className="text-lg font-semibold text-[#ffc130]">{cat.title}</h4>
              <p className="text-gray-600">{cat.description}</p>
              <p className="text-sm text-gray-500">{cat.topics} chủ đề • {cat.posts} bài viết</p>
            </div>
            <div className="text-right text-sm">
              <p>{cat.lastPost}</p>
              <p className="font-medium text-[#ffc130]">{cat.lastUser}</p>
            </div>
          </div>
        ))}

        {/* Recent Posts */}
        <h3 className="flex items-center gap-2 text-xl font-bold text-[#ffc130] mt-8 mb-4">
          <FaClock /> Bài viết gần đây
        </h3>
        {recentPosts.map(post => (
          <div key={post.id} className="bg-white p-4 mb-2 rounded-lg shadow-sm hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-[#ffc130] flex items-center gap-2">
                  {post.isPinned && <FaThumbtack className="text-orange-500" />}
                  {post.title}
                </h4>
                <p className="text-sm text-gray-500">
                  bởi {post.author} • {post.time} • <span className="italic">{post.category}</span>
                </p>
              </div>
              <div className="flex items-center gap-4 text-gray-500 text-sm">
                <span className="flex items-center gap-1"><FaRegCommentDots /> {post.replies}</span>
                <span className="flex items-center gap-1"><FaEye /> {post.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-[#193701] w-14 h-14 rounded-full shadow-lg flex items-center justify-center">
          <FaPhone className="text-white w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

export default Forum
