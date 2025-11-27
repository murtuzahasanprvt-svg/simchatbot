
import React from 'react';
import { Language, UserProfile } from '../types';
import { ASSETS } from '../data/restaurantData';

interface ProfileViewProps {
  language: Language;
  userProfile: UserProfile | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ language, userProfile }) => {
  // If no profile yet, show guest state
  const user = userProfile ? {
    name: userProfile.name,
    phone: userProfile.phone,
    points: userProfile.ordersCount * 10, // Simple mock points logic
    memberSince: userProfile.memberSince
  } : {
    name: "Guest",
    phone: "",
    points: 0,
    memberSince: "-"
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
       <div className="relative bg-orange-600 text-white pb-10 pt-8 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md mb-3">
               <img src={ASSETS.user_avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
             </div>
             <h2 className="font-bold text-xl">{user.name}</h2>
             {user.phone ? (
                <p className="text-orange-100 text-sm font-medium">{user.phone}</p>
             ) : (
                <p className="text-orange-200 text-xs italic mt-1">{language === 'bn' ? 'অর্ডার করে প্রোফাইল তৈরি করুন' : 'Place an order to create profile'}</p>
             )}
             
             <div className="flex gap-8 mt-6 w-full justify-center">
                <div className="text-center">
                   <span className="block font-extrabold text-2xl">{user.points}</span>
                   <span className="text-xs text-orange-200 uppercase tracking-wider font-bold">Points</span>
                </div>
                <div className="w-[1px] bg-orange-400/50"></div>
                <div className="text-center">
                   <span className="block font-bold text-xl mt-0.5">{user.points > 100 ? 'Gold' : user.points > 50 ? 'Silver' : 'Bronze'}</span>
                   <span className="text-xs text-orange-200 uppercase tracking-wider font-bold">Level</span>
                </div>
             </div>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide ml-1">Settings</h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             {userProfile && (
                 <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                       </div>
                       <span className="text-sm font-medium text-gray-700">{language === 'bn' ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}</span>
                    </div>
                    <svg className="text-gray-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                 </button>
             )}
             
             <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   </div>
                   <span className="text-sm font-medium text-gray-700">{language === 'bn' ? 'সংরক্ষিত ঠিকানা' : 'Saved Addresses'}</span>
                </div>
                <svg className="text-gray-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </button>

             <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                   </div>
                   <span className="text-sm font-medium text-gray-700">{language === 'bn' ? 'সাহায্য ও সাপোর্ট' : 'Help & Support'}</span>
                </div>
                <svg className="text-gray-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </button>
          </div>
       </div>
    </div>
  );
};