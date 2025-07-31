const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: {
    name: 'giphy',
    description: 'Searches Giphy for a GIF',
    options: [
      {
        type: 3, // STRING
        name: 'query',
        description: 'The search term',
        required: true
      }
    ]
  },
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const apiKey = process.env.GIPHY_API_KEY;

    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=10&rating=pg`);
      const data = await res.json();
      if (!data.data.length) {
        return interaction.reply(`No GIFs found for "${query}".`);
      }

      const gifUrl = data.data[Math.floor(Math.random() * data.data.length)].images.original.url;
      await interaction.reply(gifUrl);
    } catch (err) {
      console.error('Giphy fetch error:', err);
      await interaction.reply('Something went wrong while fetching a GIF.');
    }
  }
};