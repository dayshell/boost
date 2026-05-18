const CDN = "https://mobbin.com/_next/static/media";

export default function ProductCover() {
  return (
    <section style={{ display: "grid", placeItems: "center", padding: "0 32px", background: "var(--bg-primary)" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 1536,
          aspectRatio: "1.9",
          overflow: "hidden",
          borderRadius: 24,
          paddingLeft: 104,
          paddingTop: 80,
          background: "var(--bg-secondary)",
          position: "relative",
        }}
      >
        <img
          src={`${CDN}/product-cover-web.13a49267.png`}
          alt="Preview image of the product interface"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top left",
            borderRadius: "16px 0 0 0",
            position: "absolute",
            inset: 0,
          }}
          onError={e => {
            const t = e.currentTarget;
            t.src = `${CDN}/product-cover-ios.adec25d8.png`;
          }}
        />
      </div>
    </section>
  );
}
