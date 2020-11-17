import { AnyChannel, GuildChannel } from 'eris';
import updateTemplateContent from '../utils/updateCounterContent';

const channelCreate = (channel: AnyChannel) => {
  if (channel instanceof GuildChannel) {
    updateTemplateContent(channel);
  }
};

export default channelCreate;
