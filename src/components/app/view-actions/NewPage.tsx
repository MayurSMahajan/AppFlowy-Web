import { ViewLayout } from '@/application/types';
import { ReactComponent as Add } from '@/assets/icons/add_new_page.svg';
import { NormalModal } from '@/components/_shared/modal';
import { notify } from '@/components/_shared/notify';
import { useAppHandlers, useAppOutline } from '@/components/app/app.hooks';
import CreateSpaceModal from '@/components/app/view-actions/CreateSpaceModal';
import SpaceList from '@/components/publish/header/duplicate/SpaceList';
import { Button } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

function NewPage() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedSpaceId, setSelectedSpaceId] = React.useState<string>('');
  const outline = useAppOutline();
  const spaceList = useMemo(() => {
    if (!outline) return [];

    return outline.map((view) => {
      return {
        id: view.view_id,
        extra: JSON.stringify(view.extra),
        name: view.name,
        isPrivate: view.is_private,
      };
    });
  }, [outline]);

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const { addPage, openPageModal } = useAppHandlers();

  const [createSpaceOpen, setCreateSpaceOpen] = React.useState(false);

  const handleAddPage = useCallback(
    async (parentId: string) => {
      if (!addPage || !openPageModal) return;
      setLoading(true);
      try {
        const viewId = await addPage(parentId, {
          layout: ViewLayout.Document,
        });

        openPageModal(viewId);
        onClose();
        // eslint-disable-next-line
      } catch (e: any) {
        notify.error(e.message);
      } finally {
        setLoading(false);
      }
    },
    [addPage, openPageModal, onClose]
  );

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<Add className={'mr-[1px]'} />}
        size={'small'}
        className={'w-full justify-start  py-1.5 text-sm font-normal hover:bg-fill-list-hover'}
        color={'inherit'}
      >
        {t('newPageText')}
      </Button>
      <NormalModal
        okText={t('button.add')}
        title={t('publish.duplicateTitle')}
        open={open}
        onClose={onClose}
        classes={{ container: 'items-start max-md:mt-auto max-md:items-center mt-[10%] ' }}
        onOk={() => {
          void handleAddPage(selectedSpaceId);
        }}
        okButtonProps={{
          disabled: !selectedSpaceId,
        }}
        okLoading={loading}
      >
        <SpaceList
          loading={false}
          spaceList={spaceList}
          value={selectedSpaceId}
          onChange={setSelectedSpaceId}
          title={
            <div className={'flex items-center text-sm text-text-caption'}>
              {t('publish.addTo')}
              {` ${t('web.or')} `}
              <Button
                onClick={() => {
                  setCreateSpaceOpen(true);
                }}
                size={'small'}
                className={'mx-1 text-sm'}
              >
                {t('space.createNewSpace')}
              </Button>
            </div>
          }
        />
      </NormalModal>
      <CreateSpaceModal
        open={createSpaceOpen}
        onClose={() => setCreateSpaceOpen(false)}
        onCreated={(spaceId: string) => {
          void handleAddPage(spaceId);
        }}
      />
    </>
  );
}

export default NewPage;
