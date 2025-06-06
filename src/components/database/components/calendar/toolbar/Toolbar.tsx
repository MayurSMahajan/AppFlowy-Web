import { CalendarEvent } from '@/application/database-yjs';
import { ReactComponent as DownArrow } from '@/assets/icons/alt_arrow_down.svg';
import { ReactComponent as LeftArrow } from '@/assets/icons/alt_arrow_left.svg';
import { ReactComponent as RightArrow } from '@/assets/icons/alt_arrow_right.svg';
import NoDate from '@/components/database/components/calendar/toolbar/NoDate';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ToolbarProps } from 'react-big-calendar';

import { useTranslation } from 'react-i18next';

interface ExtendedToolbarProps extends ToolbarProps<CalendarEvent, object> {
  emptyEvents: CalendarEvent[];
}

export function Toolbar({
  onNavigate,
  date,
  emptyEvents,
}: ExtendedToolbarProps) {
  const dateStr = useMemo(() => dayjs(date).format('MMM YYYY'), [date]);
  const { t } = useTranslation();

  return (
    <div className={'flex items-center justify-between overflow-x-auto overflow-y-hidden'}>
      <div className={'whitespace-nowrap text-sm font-medium'}>{dateStr}</div>
      <div className={'flex items-center justify-end gap-2 max-sm:gap-1'}>
        <IconButton size={'small'} onClick={() => onNavigate('PREV')}>
          <LeftArrow />
        </IconButton>
        <Button
          className={'h-6 font-normal max-sm:min-w-fit'}
          size={'small'}
          variant={'text'}
          color={'inherit'}
          onClick={() => onNavigate('TODAY')}
        >
          {t('calendar.navigation.today')}
        </Button>
        <IconButton size={'small'} onClick={() => onNavigate('NEXT')}>
          <RightArrow />
        </IconButton>
        <Button
          size={'small'}
          variant={'outlined'}
          disabled
          className={'rounded-md border-line-divider'}
          color={'inherit'}
          onClick={() => onNavigate('TODAY')}
          endIcon={<DownArrow className={'h-3 w-3 text-text-caption'} />}
        >
          {t('calendar.navigation.views.month')}
        </Button>
        <NoDate emptyEvents={emptyEvents} />
      </div>
    </div>
  );
}

export default Toolbar;
