import EventBus from './src/eventbus';
import proConfigs from './src/pro-cfg';
import startLoad from './src/start-load';

window.$GlobalSyncEventBus = new EventBus('sync');
window.$GlobalAsyncEventBus = new EventBus('async');

startLoad(proConfigs);
