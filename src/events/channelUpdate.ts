import { AnyChannel, GuildChannel } from 'eris';
import updateTemplateContent from '../utils/updateCounterContent';

const channelUpdate = (channel: AnyChannel) => {
  if (channel instanceof GuildChannel) {
    updateTemplateContent(channel);
  }
};

export default channelUpdate;
