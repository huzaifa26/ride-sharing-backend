import axios from "axios";

export async function getGooglePlaces (req,res) {
  const {place}=req.params;
  var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+place+'&types=establishment&radius=500&key=AIzaSyAyo7SHKsH86GdRBd8QuEJV_1vAROC6sAo';

  axios.get(url)
    .then(function (response) {
      res.send(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}