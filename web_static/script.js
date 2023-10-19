const app = Vue.createApp({
  data() {
    return {
      customer_name: '',
      date: '',
      time: '',
      service: '',
      showNotification: false,
    };
  },
  methods: {
    handleSubmit(event) {
      event.preventDefault();
      // Make a POST request to the server
      axios
        .post('https://color-couture.onrender.com/submit', {
          customer_name: this.customer_name,
          date: moment(this.date, 'DD-MM-YYYY').format('YYYY-MM-DD'),
          time: this.time,
          service: this.service,
          showNotification: false,
        })
        .then((response) => {
          console.log(response.data); // Success message from the server
          // Display a confirmation message to the user
          this.showNotification = true;
          this.notificationMessage = 'Enjoy your date with us!!';
          // Reset the form
          this.customer_name = '';
          this.date = '';
          this.time = '';
          this.service = '';
          // Set a timer to hide the notification after 6 seconds
          setTimeout(() => {
            this.showNotification = false;
            this.notificationMessage = '';
          }, 6000);
        })
        .catch((error) => {
          console.log(error.response.data); // Error message from the server
          // Display an error message to the user
        });
    },
  },
});

app.mount('#app');
