const express = require('express');
require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());

// Load the toxicity model
toxicity.load().then(model => {

  // Define the API endpoint for toxicity prediction
  app.post('/api/toxicity', async (req, res) => {
    try {
      // Get the value from the request body
      console.log(req.body);
      const value = req.body.value;

      // Make a prediction using the toxicity model
      const predictions = await model.classify([value]);

      // Check if the value is toxic or not
      let isToxic = false;
      predictions.forEach(prediction => {
        if(prediction.results[0].match) {
          isToxic = true;
        }
      });

      // Send the result as JSON response
      res.json({ isToxic });
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while processing the request');
    }
  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
    