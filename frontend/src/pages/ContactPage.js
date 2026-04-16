import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import API from "../api/axios";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function validateForm(e) {
    e.preventDefault();

    setNameError("");
    setEmailError("");
    setMessageError("");

    let valid = true;

    if (name.trim() === "") {
      setNameError("Name is required");
      valid = false;
    }

    if (email.trim() === "") {
      setEmailError("Email is required");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      valid = false;
    }

    if (message.trim() === "") {
      setMessageError("Message is required");
      valid = false;
    } else if (message.length < 10) {
      setMessageError("Message must be at least 10 characters");
      valid = false;
    }

    if (valid) {
      try {
        const response = await API.post("/contact", { name, email, message });
        if (response.data.success) {
          alert("Message Sent Successfully!!!");
          setName("");
          setEmail("");
          setMessage("");
        } else {
          alert("Failed to send message.");
        }
      } catch (error) {
        alert("Error sending message.");
        console.error(error);
      }
    }
  }

  return (
    <div>
      <Header />
      <div className="contact">
        <h2>Contact Me ❤ !</h2>
        <p>You May Send Me a Message if You Want</p>
      </div>

      <hr className="hori" />

      <div className="cont">
        <p>CONTACT FORM</p>
        <form onSubmit={validateForm}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <span className="error">{nameError}</span>
          </div>

          <br />

          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <span className="error">{emailError}</span>
          </div>

          <br />

          <div>
            <label>Message: </label>
            <textarea
              rows="5"
              cols="32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <br />
            <span className="error">{messageError}</span>
          </div>

          <button type="submit" className="button">Submit</button>
        </form>
      </div>

      <br />
      <hr className="hori" />

      <div className="text1">
        <h2>Relevant Resources</h2>
      </div>

      <div className="resource-con">
        <table className="resources">
          <thead>
            <tr>
              <th>RESOURCE NAME</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p>Website/App</p>
                <div className="link-con">
                  <a href="https://www.webtoons.com/en/">
                    WEBTOON - Read Comics, Manga, and Manhwa
                  </a>
                </div>
              </td>
              <td>
                <p>
                  <span>W</span>EBTOON is a free digital platform where you can read millions of comics, manga, and manhwa episodes across diverse genres like romance, action, thriller, and fantasy. It's one of the world's largest webcomic communities, with both fans and creators contributing stories.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Website/App</p>
                <div className="link-con">
                  <a href="https://mangatoon.mobi/en/book/list">
                    MANGATOON - Read Free Online Yaoi, BL, romance manga
                  </a>
                </div>
              </td>
              <td>
                <p>
                  <span>M</span>angaToon is a free mobile app for reading comics, manga, manhua (Chinese comics), and manhwa (Korean comics), offering colorful stories across genres like romance, action, fantasy, BL, comedy, and horror.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Book</p>
                <div className="link-con">
                  <a href="https://www.lezhinus.com/en/comic/evilduchess_allages">
                    The Evil Grand Duchess Has a Secret Life - All-Ages Edition
                  </a>
                </div>
              </td>
              <td>
                <p>
                  <span>W</span>hen a top actress named Elise is killed by her boyfriend, she gets transmigrated into the villainess of a story she was supposed to star in.
                </p>
              </td>
            </tr>

            <tr>
              <td>
                <p>Book</p>
                <div className="link-con">
                  <a href="https://www.webtoons.com/en/action/the-greatest-assassin-in-another-world/list?title_no=8996">
                    The Top Assassin in Another World
                  </a>
                </div>
              </td>
              <td>
                <p>
                  <span>K</span>ai Shinjo, an ordinary high school student by day and a deadly assassin by night, hides behind his quiet, dark demeanor.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />
      <hr className="hori" />

      <br />

      <div id="text2">
        <p>MAP</p>
      </div>

      <br />

      <div id="map-con">
        <iframe
          title="map"
          src="https://www.google.com/maps?q=Agoo,+La+Union,+Philippines&output=embed"
          loading="lazy"
          style={{ border: 0 }}
        ></iframe>
      </div>

      <br />

      <div id="text-loca">
        <p>This is the location of where you can physically see or buy the Three Ms</p>
      </div>

      <br />
      <Footer />
    </div>
  );
}

export default ContactPage;