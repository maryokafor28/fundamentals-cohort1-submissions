import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../schema/users';
import { Products } from '../schema/products';
import { generateHashPassword } from '../utility/auth-utils';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    @InjectModel(Products.name) private productModel: Model<Products>,
  ) {}

  async seedUsers() {
    const existingUsers = await this.userModel.countDocuments();
    if (existingUsers > 0) return;

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await generateHashPassword('admin123'),
        type: 'admin',
        isVerified: true,
      },
      {
        name: 'John Customer',
        email: 'customer@example.com',
        password: await generateHashPassword('customer123'),
        type: 'customer',
        isVerified: true,
      },
    ];

    await this.userModel.insertMany(users);
    console.log('✅ Users seeded successfully');
  }

  async seedProducts() {
    // Always clear and reseed products
    await this.productModel.deleteMany({});
    console.log('🗑️ Cleared existing products');

    const products = [
      // Mac Application Software
      {
        productName: 'Final Cut Pro X',
        description: 'Professional video editing software for Mac',
        category: 'Application Software',
        platformType: 'Mac',
        baseType: 'Computer',
        productUrl: 'https://apple.com/final-cut-pro',
        downloadUrl: 'https://apps.apple.com/app/final-cut-pro',
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500',
        highlights: ['4K Video Editing', 'Motion Graphics', 'Color Grading', 'Audio Editing'],
        requirementSpecification: [
          { name: 'OS', value: 'macOS 12.6 or later' },
          { name: 'Memory', value: '8GB RAM' },
          { name: 'Storage', value: '4GB available space' },
        ],
        skuDetails: [{ price: 299, validity: 365, lifetime: true, stripePriceId: 'price_final_cut' }],
        avgRating: 4.8,
      },
      {
        productName: 'Logic Pro',
        description: 'Professional music production software for Mac',
        category: 'Application Software',
        platformType: 'Mac',
        baseType: 'Computer',
        productUrl: 'https://apple.com/logic-pro',
        downloadUrl: 'https://apps.apple.com/app/logic-pro',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500',
        highlights: ['Audio Recording', 'MIDI Editing', 'Virtual Instruments', 'Mixing'],
        requirementSpecification: [
          { name: 'OS', value: 'macOS 12.6 or later' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '6GB available space' },
        ],
        skuDetails: [{ price: 199, validity: 365, lifetime: true, stripePriceId: 'price_logic_pro' }],
        avgRating: 4.7,
      },
      // Windows Application Software
      {
        productName: 'Adobe Creative Suite',
        description: 'Complete creative software package for Windows',
        category: 'Application Software',
        platformType: 'Windows',
        baseType: 'Computer',
        productUrl: 'https://adobe.com/creative-cloud',
        downloadUrl: 'https://adobe.com/downloads',
        image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=500',
        highlights: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects'],
        requirementSpecification: [
          { name: 'OS', value: 'Windows 10 or later' },
          { name: 'Memory', value: '16GB RAM' },
          { name: 'Storage', value: '20GB available space' },
        ],
        skuDetails: [{ price: 599, validity: 365, lifetime: false, stripePriceId: 'price_adobe_suite' }],
        avgRating: 4.6,
      },
      {
        productName: 'Microsoft Office 365',
        description: 'Complete productivity suite for Windows',
        category: 'Application Software',
        platformType: 'Windows',
        baseType: 'Computer',
        productUrl: 'https://microsoft.com/office',
        downloadUrl: 'https://office.com/download',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
        highlights: ['Word', 'Excel', 'PowerPoint', 'Outlook'],
        requirementSpecification: [
          { name: 'OS', value: 'Windows 10 or later' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '4GB available space' },
        ],
        skuDetails: [{ price: 149, validity: 365, lifetime: false, stripePriceId: 'price_office_365' }],
        avgRating: 4.5,
      },
      // Linux Application Software
      {
        productName: 'GIMP Professional',
        description: 'Advanced image editing software for Linux',
        category: 'Application Software',
        platformType: 'Linux',
        baseType: 'Computer',
        productUrl: 'https://gimp.org',
        downloadUrl: 'https://gimp.org/downloads',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
        highlights: ['Photo Retouching', 'Digital Art', 'Plugins Support', 'Customizable'],
        requirementSpecification: [
          { name: 'OS', value: 'Linux Ubuntu 18.04+' },
          { name: 'Memory', value: '2GB RAM' },
          { name: 'Storage', value: '1GB available space' },
        ],
        skuDetails: [{ price: 49, validity: 365, lifetime: true, stripePriceId: 'price_gimp_pro' }],
        avgRating: 4.4,
      },
      {
        productName: 'Blender Studio',
        description: '3D creation suite for Linux professionals',
        category: 'Application Software',
        platformType: 'Linux',
        baseType: 'Computer',
        productUrl: 'https://blender.org',
        downloadUrl: 'https://blender.org/download',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
        highlights: ['3D Modeling', 'Animation', 'Rendering', 'Sculpting'],
        requirementSpecification: [
          { name: 'OS', value: 'Linux 64-bit' },
          { name: 'Memory', value: '8GB RAM' },
          { name: 'Storage', value: '2GB available space' },
        ],
        skuDetails: [{ price: 99, validity: 365, lifetime: true, stripePriceId: 'price_blender_studio' }],
        avgRating: 4.8,
      },
      // iOS Mobile Apps
      {
        productName: 'Procreate Premium',
        description: 'Professional digital art app for iPad',
        category: 'Application Software',
        platformType: 'iOS',
        baseType: 'Mobile',
        productUrl: 'https://procreate.art',
        downloadUrl: 'https://apps.apple.com/app/procreate',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500',
        highlights: ['Digital Painting', 'Vector Art', 'Animation', 'Brushes'],
        requirementSpecification: [
          { name: 'OS', value: 'iOS 15.0 or later' },
          { name: 'Device', value: 'iPad compatible' },
          { name: 'Storage', value: '500MB available space' },
        ],
        skuDetails: [{ price: 12.99, validity: 365, lifetime: true, stripePriceId: 'price_procreate' }],
        avgRating: 4.9,
      },
      {
        productName: 'LumaFusion Pro',
        description: 'Professional video editing for iOS',
        category: 'Application Software',
        platformType: 'iOS',
        baseType: 'Mobile',
        productUrl: 'https://luma-touch.com/lumafusion',
        downloadUrl: 'https://apps.apple.com/app/lumafusion',
        image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500',
        highlights: ['Multi-track Editing', '4K Support', 'Effects', 'Audio Mixing'],
        requirementSpecification: [
          { name: 'OS', value: 'iOS 14.0 or later' },
          { name: 'Device', value: 'iPhone/iPad' },
          { name: 'Storage', value: '1GB available space' },
        ],
        skuDetails: [{ price: 29.99, validity: 365, lifetime: true, stripePriceId: 'price_lumafusion' }],
        avgRating: 4.7,
      },
      // Android Mobile Apps
      {
        productName: 'Android Studio Pro',
        description: 'Professional Android development suite',
        category: 'Application Software',
        platformType: 'Android',
        baseType: 'Mobile',
        productUrl: 'https://developer.android.com/studio',
        downloadUrl: 'https://developer.android.com/studio/download',
        image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=500',
        highlights: ['Code Editor', 'Emulator', 'Debugging', 'Performance Tools'],
        requirementSpecification: [
          { name: 'OS', value: 'Android 7.0 or later' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '2GB available space' },
        ],
        skuDetails: [{ price: 199, validity: 365, lifetime: false, stripePriceId: 'price_android_studio' }],
        avgRating: 4.6,
      },
      // Operating Systems
      {
        productName: 'Windows 11 Pro',
        description: 'Latest Windows operating system for professionals',
        category: 'Operating System',
        platformType: 'Windows',
        baseType: 'Computer',
        productUrl: 'https://microsoft.com/windows',
        downloadUrl: 'https://microsoft.com/software-download/windows11',
        image: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=500',
        highlights: ['Enhanced Security', 'Virtual Desktops', 'Microsoft Teams', 'Gaming Features'],
        requirementSpecification: [
          { name: 'Processor', value: '1 GHz or faster' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '64GB available space' },
        ],
        skuDetails: [{ price: 199, validity: 365, lifetime: true, stripePriceId: 'price_windows_11' }],
        avgRating: 4.5,
      },
      {
        productName: 'Ubuntu Server LTS',
        description: 'Enterprise-grade Linux server operating system',
        category: 'Operating System',
        platformType: 'Linux',
        baseType: 'Computer',
        productUrl: 'https://ubuntu.com/server',
        downloadUrl: 'https://ubuntu.com/download/server',
        image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500',
        highlights: ['Long Term Support', 'Security Updates', 'Container Support', 'Cloud Ready'],
        requirementSpecification: [
          { name: 'Processor', value: '2 GHz dual core' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '25GB available space' },
        ],
        skuDetails: [{ price: 99, validity: 1825, lifetime: false, stripePriceId: 'price_ubuntu_server' }],
        avgRating: 4.8,
      },
      {
        productName: 'macOS Ventura',
        description: 'Latest macOS with advanced features',
        category: 'Operating System',
        platformType: 'Mac',
        baseType: 'Computer',
        productUrl: 'https://apple.com/macos/ventura',
        downloadUrl: 'https://apps.apple.com/app/macos-ventura',
        image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=500',
        highlights: ['Stage Manager', 'Continuity Camera', 'Safari Improvements', 'Mail Enhancements'],
        requirementSpecification: [
          { name: 'Mac Model', value: 'MacBook Air (2018 or later)' },
          { name: 'Memory', value: '4GB RAM' },
          { name: 'Storage', value: '26GB available space' },
        ],
        skuDetails: [{ price: 0, validity: 365, lifetime: true, stripePriceId: 'price_macos_ventura' }],
        avgRating: 4.7,
      },
      {
        productName: 'Adobe Photoshop',
        description: 'Professional photo editing software for Windows',
        category: 'Application Software',
        platformType: 'Windows',
        baseType: 'Computer',
        productUrl: 'https://adobe.com/photoshop',
        downloadUrl: 'https://adobe.com/downloads/photoshop',
        image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=500',
        highlights: ['Photo Editing', 'Digital Art', 'Layer Support', 'Filters'],
        requirementSpecification: [
          { name: 'OS', value: 'Windows 10 or later' },
          { name: 'Memory', value: '8GB RAM' },
          { name: 'Storage', value: '4GB available space' },
        ],
        skuDetails: [{ price: 249, validity: 365, lifetime: false, stripePriceId: 'price_photoshop' }],
        avgRating: 4.6,
      },
      {
        productName: 'Xcode Developer Tools',
        description: 'Complete iOS development environment for Mac',
        category: 'Application Software',
        platformType: 'Mac',
        baseType: 'Computer',
        productUrl: 'https://developer.apple.com/xcode',
        downloadUrl: 'https://apps.apple.com/app/xcode',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
        highlights: ['iOS Development', 'Swift Programming', 'Interface Builder', 'Simulator'],
        requirementSpecification: [
          { name: 'OS', value: 'macOS 13.0 or later' },
          { name: 'Memory', value: '8GB RAM' },
          { name: 'Storage', value: '15GB available space' },
        ],
        skuDetails: [{ price: 0, validity: 365, lifetime: true, stripePriceId: 'price_xcode' }],
        avgRating: 4.5,
      },
    ];

    await this.productModel.insertMany(products);
    console.log('✅ Products seeded successfully');
  }

  async seedAll() {
    await this.seedUsers();
    await this.seedProducts();
    console.log('🎉 All seed data created successfully!');
  }
}