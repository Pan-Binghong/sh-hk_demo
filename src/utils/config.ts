const getConfig = (prefix: string) => {
  const config = {
    getBaseUrl: () =>
      localStorage.getItem(`${prefix}_base_url`) || 'https://api.coze.cn',
    getBaseWsUrl: () =>
    localStorage.getItem(`${prefix}_base_ws_url`) || 'wss://ws.coze.cn',
    // getPat: () => 'pat_oXOpadL8mHRmKp1l51nBFhJet38x4vKjVG7Sle4arulY0YsTDJfbpj34BacSDFo1',
    getPat: () => 'pat_yl9preKyHuofrNWQvmEXMqV56Og03Foo3APgyYicvRNiT9ftJfovqWDdV0U3QWCT',
    getExpiresIn: () => localStorage.getItem(`${prefix}_expires_in`) || '',
    // getBotId: () => '7524228267285577782', // 香港自在社
    getBotId: () => '7524555919939141658', // 3.0 demo
    // getBotId: () => '7522456373482029095', // 2.0 demo
    // getBotId: () => '7519370550456975401', // 1.0 demo
    getVoiceId: () => localStorage.getItem(`${prefix}_voice_id`) || '',
    getWorkflowId: () => localStorage.getItem(`${prefix}_workflow_id`) || '',
    getChatUpdate: () => JSON.parse(localStorage.getItem('chatUpdate') || '{}'),
  };
  return config;
};

export default getConfig;
