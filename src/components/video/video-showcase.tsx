"use client";

export function VideoShowcase() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source
          src="https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F7fef6525e5c648239ca763daac2aa5b5?alt=media&token=36e154a8-b360-4308-8650-083fb01ffd71&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
