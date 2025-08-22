"use client";

export function VideoShowcase() {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      >
        <source
          src="https://cdn.builder.io/o/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F7fef6525e5c648239ca763daac2aa5b5?alt=media&token=36e154a8-b360-4308-8650-083fb01ffd71&apiKey=f1ce823622ae4b55a2cc7cc1ca8532c5"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* KarigarSetu Logo Overlay to hide watermark */}
      <div className="absolute bottom-8 right-8 z-10">
        <div className="bg-white rounded-lg p-3 shadow-lg">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Ff1ce823622ae4b55a2cc7cc1ca8532c5%2F6d422358c98e44aeb6a3f1084dad859a?format=webp&width=800"
            alt="KarigarSetu"
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
