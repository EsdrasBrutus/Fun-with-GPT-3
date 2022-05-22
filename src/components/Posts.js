import React, { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchResponse } from "../api";
import "./Posts.css";
import robo from "../images/robot-head.png";

const Posts = () => {
	const initialState = {
		prompt: "",
		model: "",
		isLoading: false,
		isValid: false,
		error: "",
	};

	const [prompt, setPrompt] = useState(initialState.prompt);
	const [model, setModel] = useState(initialState.model);
	const [posts, setPosts] = useLocalStorage("reponses", []);
	const [isLoading, setIsLoading] = useState(initialState.isLoading);
	const [isValid, setIsValid] = useState(initialState.isValid);
	const [error, setError] = useState(initialState.error);

	//array of preset prompts
	const presetPrompts = [
		"Write a poem about the sky.",
		"How much wood could a woodchuck chuck if a woodchuck could chuck wood?",
		"How many dogs does it take to screw in a lightbulb?",
		"Write a movie title about cats.",
		"Tell me a brief story about a dragon.",
		"How do I make scrambled eggs?",
	];

	//send prompt to api and set response to response from api
	const handleSubmit = (e) => {
		e.preventDefault();
		validate();
		if (isValid) {
			setIsLoading(true);
			fetchResponse(model, prompt)
				.then((res) => {
					const newPost = {
						prompt: prompt,
						response: res.text,
					};
					setPosts([...posts, newPost]);
					setPrompt("");
					setIsLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	//set prompty to random preset prompt that is not currently in use
	const handlePresetPrompt = (e) => {
		e.preventDefault();
		let randomPresetPrompt =
			presetPrompts[Math.floor(Math.random() * presetPrompts.length)];
		while (randomPresetPrompt === prompt) {
			randomPresetPrompt =
				presetPrompts[Math.floor(Math.random() * presetPrompts.length)];
		}
		setPrompt(randomPresetPrompt);
	};

	//if prompt or model is empty, set isValid to false
	const validate = () => {
		if (prompt === "" || model === "") {
			setIsValid(false);
			setError("Please enter a prompt and model");
		} else {
			setIsValid(true);
			setError("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && isValid) {
			handleSubmit(e);
		}
	};

	const handleDelete = (e) => {
		//delete post
		e.preventDefault()
		const newPosts = posts.filter((post) => post.response !== e.target.value)
		setPosts(newPosts)
	}

	return (
		<div className="container">
			<div className="prompt-container">
				<h1>Fun with GPT-3</h1>
				<img src={robo} alt={"robot logo"} style={{ width: "100px" }} />
				<form className="promptBox">
					<select
						className="model-select"
						onChange={(e) => setModel(e.target.value)}
					>
						<option value="">Select a Model</option>
						<option value="https://api.openai.com/v1/engines/text-ada-001/completions">
							Ada
						</option>
						<option value="https://api.openai.com/v1/engines/text-babbage-001/completions">
							Babbage
						</option>
						<option value="https://api.openai.com/v1/engines/text-curie-001/completions">
							Curie
						</option>
						<option value="https://api.openai.com/v1/engines/text-davinci-001/completions">
							Davinci
						</option>
					</select>
					<span style={{ color: "red", marginLeft: "10px" }}>{error}</span>

					<textarea
						className="textBox"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Enter your prompt here"
						onKeyDown={handleKeyPress}
					/>
					<div className="button-group">
						<div className="button-container">
							<button
								className="preset-prompt-button"
								onClick={handlePresetPrompt}
							>
								Random Prompt
							</button>
						</div>
						<div className="button-container">
							<button
								className="clear-button"
								onClick={(e) => {
									e.preventDefault();
									setPrompt("");
								}}
							>
								Clear
							</button>
						</div>
					</div>

					<button
						className="submit-button"
						disabled={isLoading}
						type="submit"
						onClick={handleSubmit}
					>
						{isLoading ? "Generating..." : "Submit"}
					</button>
				</form>
			</div>
			<div className="post-container">
				<h2>AI Responses</h2>
				<div className="posts">
					{posts
						.map((post, index) => {
							return (
								<div className="post" key={index}>
									{/* delete x button on top right of post */}
									<button className="delete-button" onClick={handleDelete} value={post.response}>x</button>
									<div style={{ display: "flex" }}>
										<p>
											<b>Prompt:</b>
										</p>
										<p style={{ marginLeft: "50px" }}>{post.prompt}</p>
									</div>
									<div style={{ display: "flex" }}>
										<p style={{ display: "flex" }}>
											<b>Response:</b>
										</p>
										<p style={{ marginLeft: "35px" }}>{post.response}</p>
									</div>
								</div>
							);
						})
						.sort((a, b) => {
							return b.key - a.key;
						})}
				</div>
			</div>
		</div>
	);
};

export default Posts;
