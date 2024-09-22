import { connect } from '@/dbConfig/dbconfig';
import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import User from '@/models/UserModel';
import mongoose from 'mongoose';


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

export async function POST(request) {
  await connect();
    const { file } = await request.json();

    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'user-uploads',
        resource_type: 'image'
      });
      console.log(result);

      return NextResponse.json({
        success: true,
        url:result.secure_url,
        message:"Avatar uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      return NextResponse.json({
        success: false,});
    }
}
