import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {
    render() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>NoteIt</h1>
                    <p>Take notes, attach files to them, and check back on everything later</p>
                </div>
            </div>
        );
    }
}