import React from 'react';
import axios from 'axios';
import { useState } from 'react';

const FileUpload = ({ setFile, uploadFile }) => {
	const PORT = 3005; // !!!
	//const [file, setFile] = useState();

	const saveFile = (e) => {
		setFile(e.target.files[0]);
	};

	/*const uploadFile = async (e) => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const res = await axios.post(`http://localhost:${PORT}/api/admin/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			//console.log(res);
		} catch (ex) {
			console.log(ex);
		}
	};*/

	// <form action='/api/admin/upload' enctype='multipart/form-data'>
	return (
		<div className='App'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					uploadFile();
					console.log('clicked to submit');
				}}>
				<input
					type='file'
					action='/api/admin/upload'
					encType='multipart/form-data'
					name='image'
					onChange={saveFile}
				/>
			</form>
		</div>
	);
};
//<button type='submit'>Upload</button>

export default FileUpload;
