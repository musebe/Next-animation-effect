import React, { useEffect, useRef, useState } from 'react';
import { useScreenshot } from 'use-react-screenshot'
import anime from 'animejs';

export default function Home() {
    const inputRef = useRef(undefined);
    const [link, setLink] = useState('');
    const [userprofile, takeScreenshot] = useScreenshot();
    useEffect(() => {
        const container = document.querySelector('.container');

        for (var i = 1; i <= 50; i++) {
            const hearts = document.createElement('div');
            hearts.classList.add('heart')
            container.appendChild(hearts);
        }

        animateHearts()
    }, [])
    function animateHearts() {
        anime({
            targets: '.heart',
            translateX: function (x) {
                return anime.random(-700, 700);
            },
            translateY: function (x) {
                return anime.random(-500, 500);
            },
            rotate: 45,
            scale: function () {
                return anime.random(1, 5)
            },
            easing: 'easeInOutBack',
            duration: 3000,
            delay: anime.stagger(10),
            complete: animateHearts,
        })
    }

    async function captionHandler  () {
        await takeScreenshot(document.body).then(function (caption) {
            if (!caption) return
            try {
                fetch('/api/upload', {
                  method: 'POST',
                  body: JSON.stringify({ data: userprofile }),
                  headers: { 'Content-Type': 'application/json' },
                })
                  .then((response) => response.json())
                  .then((data) => {
                    setLink(data.data);
                  });
              } catch (error) {
                console.error(error);
              }
        })
    }

    return (
        <>
            <div className="item">
                {link? <h3><b>Uploaded</b></h3>: <h3>Double Click anywhere to save Caption</h3>}
            </div>
            <div className="container" onClick={captionHandler}>
                <div className="heart"></div>
            </div>
        </>
    )
}
