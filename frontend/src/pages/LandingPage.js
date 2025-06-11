import React from "react";
import "../style/App.css";
import "bulma/css/bulma.min.css";

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="hero is-primary is-fullheight"
        style={{
          backgroundImage: `url('${process.env.PUBLIC_URL}/LandingPage.jpg')`, //
          backgroundSize: "cover", //
          backgroundPosition: "center", //
        }}
      >
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title is-1 has-text-white">
              Selamat Datang di Aplikasi Perpustakaan
            </h1>
            <p className="subtitle is-3 has-text-white">
              Temukan dan Pinjam Buku Favorit Anda dengan Mudah
            </p>
            <div className="buttons is-centered">
              <a
                href="/login"
                className="button is-light is-large has-background-brown"
              >
                Mulai Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Opsional) */}
      <footer className="footer has-background-warning-dark has-text-white is-small-padding">
        <div className="content has-text-centered ">
          <p>
            <strong>Aplikasi Perpustakaan </strong>| Created by Muhammad Ikhsan
            <br />
            &copy; 2025.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
