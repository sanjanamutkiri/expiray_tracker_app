import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const tasks = [
  {
    id: 1,
    title: 'Build Homepage UI',
    progress: 75,
    members: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'],
  },
  {
    id: 2,
    title: 'API Integration',
    progress: 50,
    members: ['https://i.pravatar.cc/150?img=3'],
  },
  {
    id: 3,
    title: 'Fix Responsive Bugs',
    progress: 30,
    members: ['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6'],
  },
];

export default function HomeDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md">
        <div className="mb-10">
          <Avatar className="w-16 h-16 mx-auto">
            <AvatarImage src="https://i.pravatar.cc/150?img=7" />
          </Avatar>
          <h2 className="text-center text-lg font-bold mt-2">John Doe</h2>
        </div>
        <nav className="space-y-4">
          <a href="#" className="block text-gray-800 hover:text-blue-600">Dashboard</a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">Tasks</a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">Notifications</a>
          <a href="#" className="block text-gray-800 hover:text-blue-600">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow">
            <Search className="text-gray-500" size={18} />
            <input type="text" placeholder="Search..." className="outline-none" />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-gray-600 cursor-pointer" />
            <Settings className="text-gray-600 cursor-pointer" />
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://i.pravatar.cc/150?img=8" />
            </Avatar>
          </div>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <Card key={task.id} className="p-4 bg-white shadow hover:shadow-lg transition-all">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <div className="flex -space-x-2">
                  {task.members.map((src, idx) => (
                    <img
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src={src}
                      alt="member"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
