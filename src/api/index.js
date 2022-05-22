import axios from "axios";

const KEY = process.env.REACT_APP_API_KEY;

export const fetchResponse = ( modelUrl, prompt) => {
	return axios
		.post(
			modelUrl,
			{
				prompt: prompt,
				max_tokens: 64,
				temperature: 1,
				top_p: 1,
				n: 1,
				stream: false,
				logprobs: null,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${KEY}`,
				},
			}
		)
		.then((res) => {
			return res.data.choices[0];
		})
		.catch((err) => {
			console.log(err);
		});
};
