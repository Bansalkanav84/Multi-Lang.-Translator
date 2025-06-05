const { createApp } = Vue;

createApp({
  data() {
    return {
      textToTranslate: '',
      translatedText: '',
      translationHistory: [],
      error: '',
      selectedLanguage: 'hi',
      languageOptions: {
        hi: 'Hindi',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        zh: 'Chinese'
      },
      darkMode: false
    };
  },
  mounted() {
    if (localStorage.getItem('darkMode') === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }
  },
  methods: {
    async translateText() {
      this.error = '';
      this.translatedText = '';
      const text = this.textToTranslate.trim();
      if (!text) {
        this.error = 'Please enter some text to translate.';
        return;
      }

      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${this.selectedLanguage}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const cleaned = data.responseData.translatedText?.replace(/\n/g, '').trim();

        if (cleaned) {
          this.translatedText = cleaned;
          this.translationHistory.unshift({
            english: text,
            translation: cleaned,
            languageName: this.languageOptions[this.selectedLanguage]
          });
          if (this.translationHistory.length > 10) this.translationHistory.pop();
        } else {
          this.error = 'Translation failed. Try again.';
        }
      } catch (e) {
        this.error = 'Error while translating. Try again later.';
        console.error(e);
      }
    },
    clearHistory() {
      this.translationHistory = [];
    },
    speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.selectedLanguage;
      window.speechSynthesis.speak(utterance);
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark');
      localStorage.setItem('darkMode', this.darkMode);
    }
  }
}).mount('#app');
