const CardInput = ({ props }) => {
	const handleSubmit = () => {};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				// query na bazo
				handleSubmit();
			}}>
			<label>Številka kartice: </label>
			<input type='text' required maxLength={4} placeholder='XXXX'></input>
			<input type='text' required maxLength={4} placeholder='XXXX'></input>
			<input type='text' required maxLength={4} placeholder='XXXX'></input>
			<input type='text' required maxLength={4} placeholder='XXXX'></input>
			<br />

			<label>Veljavnost: </label>
			<select required name='mesec'>
				<option value='1'>1</option>
				<option value='2'>2</option>
				<option value='3'>3</option>
				<option value='4'>4</option>
				<option value='5'>5</option>
				<option value='6'>6</option>
				<option value='7'>7</option>
				<option value='8'>8</option>
				<option value='9'>9</option>
				<option value='10'>10</option>
				<option value='11'>11</option>
				<option value='12'>12</option>
			</select>
			<select required name='leto'>
				<option value='23'>23</option>
				<option value='24'>24</option>
				<option value='25'>25</option>
				<option value='26'>26</option>
				<option value='27'>27</option>
				<option value='28'>28</option>
				<option value='29'>29</option>
				<option value='30'>30</option>
				<option value='31'>31</option>
				<option value='32'>32</option>
				<option value='33'>33</option>
			</select>
			<br />

			<label>CVC2/CVV2: </label>
			<input type='text' required maxLength={3}></input>

			<button type='submit'>Potrdi plačilo</button>
		</form>
	);
};

export default CardInput;
