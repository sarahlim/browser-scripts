// @format

const config = {
  CONGRATS_MODAL_SELECTOR: '#congratulations-modal',
  RESULTS_REGEX: /You solved today’s (easy|medium|hard) puzzle in ([\d:]+)/,
  FORM_RESPONSE_URL:
    'https://docs.google.com/forms/d/e/1FAIpQLSc-hc35i04BrGa2x1KmGDqA3b95vx3ueWyn30E1LStbHuz-AA/formResponse',
  LEVEL_FIELD_NAME: 'entry.410406004',
  TIME_FIELD_NAME: 'entry.1304474061',
};

function captureResults(modal) {
  const [_, level, time] = modal.textContent.match(config.RESULTS_REGEX);
  if (!level || !time) {
    console.error('captureResults: could not parse level or time');
    return null;
  }
  return { level, time };
}

function recordTime({ level, time }) {
  const url = `${config.FORM_RESPONSE_URL}?${
    config.LEVEL_FIELD_NAME
  }=${level}&${
    config.TIME_FIELD_NAME
  }=${time}&fvv=1&draftResponse=%5Bnull%2Cnull%2C"8184517513181990518"%5D%0D%0A&pageHistory=0&fbzx=8184517513181990518`;
  fetch(url, { method: 'POST', mode: 'no-cors' });
}

function handleMutation(mutations) {
  for (const mutation of mutations) {
    if (mutation.type !== 'childList') {
      return;
    }

    const {
      addedNodes: [...addedNodes],
    } = mutation;
    const [modal] = addedNodes.filter(node => node.matches(config.CONGRATS_MODAL_SELECTOR));

    if (modal) {
      const { level, time } = captureResults(modal);
      recordTime({ level, time });
      observer.disconnect();
      console.log('Recorded sudoku');
      break;
    }
  }
}

const target = document.body;
const observer = new MutationObserver(handleMutation);
observer.observe(target, { childList: true });
