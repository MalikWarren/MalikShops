import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import {toast} from 'react-toastify';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';

// WNBA teams and players data
const wnbaTeams = [
  'Atlanta Dream',
  'Chicago Sky',
  'Connecticut Sun',
  'Dallas Wings',
  'Indiana Fever',
  'Las Vegas Aces',
  'Los Angeles Sparks',
  'Minnesota Lynx',
  'New York Liberty',
  'Phoenix Mercury',
  'Seattle Storm',
  'Washington Mystics',
  'Golden State Valkyries',
];

const teamPlayers = {
  'Atlanta Dream': [
    'Rhyne Howard',
    'Maya Caldwell',
    'Allisha Gray',
    'Nia Coffey',
    'Brionna Jones',
    'Jordin Canada',
    'Brittney Griner',
    'Naz Hillmon',
    'Te-Hina Paopao',
    'Taylor Thierry',
    'Shatori Walker-Kimbrough',
  ],
  'Chicago Sky': [
    'Rebecca Allen',
    'Angel Reese',
    'Courtney Vandersloot',
    'Ariel Atkins',
    'Rachel Banham',
    'Kamilla Cardoso',
    'Moriah Jefferson',
    'Kia Nurse',
    'Michaela Onyenwere',
    'Hailey Van Lith',
    'Maddy Westbeld',
    'Elizabeth Williams',
  ],
  'Connecticut Sun': [
    'Lindsay Allen',
    'Jaelyn Brown',
    'Tina Charles',
    'Kariata Diaby',
    'Bria Hartley',
    'Leila Lacan',
    'Marina Mabrey',
    'Rayah Marshall',
    'Aneesah Morrow',
    'Olivia Nelson-Ododa',
    'Haley Peters',
    'Saniya Rivers',
    'Jacy Sheldon',
  ],
  'Dallas Wings': [
    'Paige Bueckers',
    'DiJonai Carrington',
    'Luisa Geiselsoder',
    'Tyasha Harris',
    'Myisha Hines-Allen',
    'Aziaha James',
    'Teaira McCowan',
    'Arike Ogunbowale',
    'JJ Quinerly',
    'Maddy Siegrist',
    'Li Yueru',
  ],
  'Golden State Valkyries': [
    'Laeticia Amihere',
    'Monique Billings',
    'Veronica Burton',
    'Kaitlyn Chen',
    'Temi Fagbenle',
    'Tiffany Hayes',
    'Carla Leite',
    'Kate Martin',
    'Janelle Salaun',
    'Stephanie Talbot',
    'Kayla Thornton',
    'Julie Vanloo',
    'Cecilia Zandalasini',
  ],
  'Indiana Fever': [
    'Aliyah Boston',
    'Caitlin Clark',
    'Sydney Colson',
    'Sophie Cunningham',
    'Damiris Dantas',
    'Natasha Howard',
    'Lexie Hull',
    'Kelsey Mitchell',
    'Makayla Timpson',
    'Brianna Turner',
  ],
  'Las Vegas Aces': [
    'Kierstan Bell',
    'Dana Evans',
    'Chelsea Gray',
    'Megan Gustafson',
    'Joyner Holmes',
    'Jewell Loyd',
    'Aaliyah Nye',
    'Cheyenne Parker-Tyus',
    'Kiah Stokes',
    "A'ja Wilson",
    'Jackie Young',
    'NaLyssa Smith',
  ],
  'Los Angeles Sparks': [
    'Julie Allemand',
    'Sarah Ashlee Barker',
    'Cameron Brink',
    'Rae Burrell',
    'Emma Cannon',
    'Sania Feagin',
    'Dearica Hamby',
    'Rickea Jackson',
    'Shey Peddy',
    'Kelsey Plum',
    'Mercedes Russell',
    'Odyssey Sims',
    'Azura Stevens',
  ],
  'Minnesota Lynx': [
    'Bridget Carleton',
    'Napheesa Collier',
    'Natisha Hiedeman',
    'Maria Kliundikova',
    'Anastasiia Olairi Kosu',
    'Kayla McBride',
    'Diamond Miller',
    'Alissa Pili',
    'Karlie Samuelson',
    'Jessica Shepard',
    'Alanna Smith',
    'Courtney Williams',
  ],
  'New York Liberty': [
    'Kennedy Burke',
    'Natasha Cloud',
    'Marquesha Davis',
    'Leonie Fiebich',
    'Rebekah Gardner',
    'Isabelle Harrison',
    'Sabrina Ionescu',
    'Marine Johannes',
    'Jonquel Jones',
    'Nyara Sabally',
    'Jaylyn Sherrod',
    'Breanna Stewart',
  ],
  'Phoenix Mercury': [
    'Monique Akoa Makani',
    'Kalani Brown',
    'Kahleah Copper',
    'Lexi Held',
    'Natasha Mack',
    'Murjanatu Musa',
    'Satou Sabally',
    'Alyssa Thomas',
    'Kathryn Westbeld',
    'Sami Whitcomb',
  ],
  'Seattle Storm': [
    'Lexie Brown',
    'Alysha Clark',
    'Zia Cooke',
    'Skylar Diggins',
    'Ezi Magbegor',
    'Dominique Malonga',
    'Nneka Ogwumike',
    'Katie Lou Samuelson',
    'Erica Wheeler',
    'Gabby Williams',
  ],
  'Washington Mystics': [
    'Georgia Amoore',
    'Shakira Austin',
    'Sonia Citron',
    'Stefanie Dolson',
    'Aaliyah Edwards',
    'Emily Engstler',
    'Kiki Iriafen',
    'Sika Kone',
    'Jade Melbourne',
    'Lucy Olsen',
    'Sug Sutton',
    'Brittney Sykes',
  ],
};

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('');
  const [player, setPlayer] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [createProduct, {isLoading: loadingCreate}] =
    useCreateProductMutation();
  const [uploadProductImage, {isLoading: loadingUpload}] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log('Form data being submitted:', {
      name,
      team,
      player,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
      isFeatured,
    });

    // Validate required fields - check for empty strings too
    if (
      !name ||
      !name.trim() ||
      !team ||
      !team.trim() ||
      !player ||
      !player.trim()
    ) {
      toast.error('Name, team, and player are required fields');
      return;
    }

    try {
      await createProduct({
        name: name.trim(),
        price: Number(price),
        image,
        brand,
        category,
        description,
        countInStock: Number(countInStock),
        team: team.trim(),
        player: player.trim(),
        isFeatured,
      }).unwrap();
      toast.success('Product created successfully');
      navigate('/admin/productlist');
    } catch (err) {
      console.error('Create product error:', err);
      console.error('Error details:', err?.data);
      toast.error(
        err?.data?.message || err?.error || 'Failed to create product'
      );
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Button
        onClick={() => navigate('/admin/productlist')}
        className='btn btn-light my-3'
      >
        Go Back
      </Button>
      <FormContainer>
        <h1>Create Product</h1>
        {loadingCreate && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter product name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='team'>
            <Form.Label>Team *</Form.Label>
            <Form.Select
              value={team}
              onChange={(e) => {
                setTeam(e.target.value);
                setPlayer(''); // Reset player when team changes
              }}
              required
            >
              <option value=''>Select a team</option>
              {wnbaTeams.map((teamName) => (
                <option
                  key={teamName}
                  value={teamName}
                >
                  {teamName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId='player'>
            <Form.Label>Player *</Form.Label>
            <Form.Control
              type='text'
              placeholder={
                team
                  ? `Enter player name (or select from ${team} roster)`
                  : 'Select a team first'
              }
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              required
              disabled={!team}
              list={team ? `${team}-players` : ''}
            />
            {team && teamPlayers[team] && (
              <datalist id={`${team}-players`}>
                {teamPlayers[team].map((playerName) => (
                  <option
                    key={playerName}
                    value={playerName}
                  />
                ))}
              </datalist>
            )}
            {team && teamPlayers[team] && (
              <Form.Text className='text-muted'>
                Suggestions: {teamPlayers[team].slice(0, 3).join(', ')}
                {teamPlayers[team].length > 3 &&
                  ` and ${teamPlayers[team].length - 3} more...`}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter image url'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <Form.Control
              label='Choose File'
              onChange={uploadFileHandler}
              type='file'
            />
            {loadingUpload && <Loader />}
          </Form.Group>

          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter count in stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='isFeatured'>
            <Form.Check
              type='checkbox'
              label='Featured Product'
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            style={{marginTop: '1rem'}}
            disabled={loadingCreate}
          >
            Create Product
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
