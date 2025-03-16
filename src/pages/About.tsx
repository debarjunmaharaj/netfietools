
import React from 'react';
import { Layout } from '@/components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">About Us</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Empowering creators with powerful digital tools
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Welcome to Netfie – your one-stop destination for all your digital content needs. We are passionate about providing cutting-edge tools that make content creation, editing, and conversion simple and accessible to everyone.
            </p>
            
            <p>
              Our mission is to democratize digital content creation by building powerful yet intuitive tools that don't require technical expertise. Whether you're a professional designer, content creator, or just someone who needs to edit an image or convert a file format, our tools are designed with you in mind.
            </p>
            
            <h2>Our Story</h2>
            
            <p>
              Founded in 2023, Netfie was born out of the frustration of having to use multiple platforms and install various software to accomplish simple digital tasks. We envisioned a world where all essential digital tools would be available in one place, accessible from any device with an internet connection.
            </p>
            
            <p>
              What started as a simple image converter has now grown into a comprehensive suite of tools spanning image editing, file conversion, text-to-speech, and much more. Our platform continues to evolve as we add new features and capabilities based on user feedback and technological advancements.
            </p>
            
            <h2>Our Values</h2>
            
            <ul>
              <li><strong>Accessibility:</strong> We believe digital tools should be accessible to everyone, regardless of technical expertise.</li>
              <li><strong>Innovation:</strong> We continually strive to incorporate the latest technologies to offer cutting-edge solutions.</li>
              <li><strong>Privacy:</strong> We respect your data privacy and ensure that your content remains yours.</li>
              <li><strong>Quality:</strong> We are committed to providing high-quality tools that deliver professional-grade results.</li>
            </ul>
            
            <h2>The Team</h2>
            
            <p>
              Behind Netfie is a team of passionate developers, designers, and digital content experts who share a common vision of making digital content creation more accessible. Our diverse team brings together expertise from various domains to create tools that are both powerful and user-friendly.
            </p>
            
            <p>
              Thank you for choosing Netfie. We're excited to be part of your creative journey and look forward to helping you bring your digital content to life!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
