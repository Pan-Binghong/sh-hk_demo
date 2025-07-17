const getConfig = (prefix: string) => {
  const config = {
    getBaseUrl: () =>
      localStorage.getItem(`${prefix}_base_url`) || 'https://api.coze.cn',
    getBaseWsUrl: () =>
    localStorage.getItem(`${prefix}_base_ws_url`) || 'wss://ws.coze.cn',
    // getPat: () => 'pat_oXOpadL8mHRmKp1l51nBFhJet38x4vKjVG7Sle4arulY0YsTDJfbpj34BacSDFo1', // 香港自编排的key 
    // getPat: () => 'pat_ny9SRcCvGcO36MQ2oALbqKJeYkatss8ZQeau7l2xsU1lKYSWpd8ptJfWnEFbGu7X', // 香港华山的key 
    // getPat: () => 'pat_ny9SRcCvGcO36MQ2oALbqKJeYkatss8ZQeau7l2xsU1lKYSWpd8ptJfWnEFbGu7X', // 香港华山的key 
    // getPat: () => 'pat_yl9preKyHuofrNWQvmEXMqV56Og03Foo3APgyYicvRNiT9ftJfovqWDdV0U3QWCT', // 上海的key
    getPat: () => 'pat_N7S9OeQdzFdomJVvwZqd76n9A5FauKyxrOSj36pt0jvohpkAU88JENR5gF5axtnN', // 上海的key 2025年7月17日
    getExpiresIn: () => localStorage.getItem(`${prefix}_expires_in`) || '',
    // getBotId: () => localStorage.getItem(`${prefix}_bot_id`) || '7524228267285577782',  // 香港自在社 自研编排  
    getBotId: () => localStorage.getItem(`${prefix}_bot_id`) || '7525282559119605779',  // 上海12356-4.0-demo  
    // getBotId: () => '7524228267285577782', // 香港自在社 自研编排
    // getBotId: () => '7525647073035960346', // 香港自在社 华山提供
    // getBotId: () => '7524555919939141658', // 3.0 demo
    // getBotId: () => '7522456373482029095', // 2.0 demo
    // getBotId: () => '7519370550456975401', // 1.0 demo
    getVoiceId: () => localStorage.getItem(`${prefix}_voice_id`) || '',
    getWorkflowId: () => localStorage.getItem(`${prefix}_workflow_id`) || '',
    getChatUpdate: () => JSON.parse(localStorage.getItem('chatUpdate') || '{}'),
  };
  return config;
};

export default getConfig;
