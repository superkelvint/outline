import find from "lodash/find";
import { observer } from "mobx-react";
import { BuildingBlocksIcon } from "outline-icons";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { IntegrationService, IntegrationType } from "@shared/types";
import Integration from "~/models/Integration";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import Input from "~/components/Input";
import Scene from "~/components/Scene";
import useStores from "~/hooks/useStores";
import SettingRow from "./components/SettingRow";

type FormData = {
  drawIoUrl: string;
  gristUrl: string;
  chatUrl: string;
};

function SelfHosted() {
  const { integrations } = useStores();
  const { t } = useTranslation();

  const integrationDiagrams = find(integrations.orderedData, {
    type: IntegrationType.Embed,
    service: IntegrationService.Diagrams,
  }) as Integration<IntegrationType.Embed> | undefined;

  const integrationGrist = find(integrations.orderedData, {
    type: IntegrationType.Embed,
    service: IntegrationService.Grist,
  }) as Integration<IntegrationType.Embed> | undefined;

  const integrationOpenAI = find(integrations.orderedData, {
    type: IntegrationType.Embed,
    service: IntegrationService.OpenAI,
  }) as Integration<IntegrationType.Embed> | undefined;

  const {
    register,
    reset,
    handleSubmit: formHandleSubmit,
    formState,
  } = useForm<FormData>({
    mode: "all",
    defaultValues: {
      drawIoUrl: integrationDiagrams?.settings.url,
      gristUrl: integrationGrist?.settings.url,
      chatUrl: integrationOpenAI?.settings.url,
    },
  });

  React.useEffect(() => {
    void integrations.fetchPage({
      type: IntegrationType.Embed,
    });
  }, [integrations]);

  React.useEffect(() => {
    reset({
      drawIoUrl: integrationDiagrams?.settings.url,
      gristUrl: integrationGrist?.settings.url,
      chatUrl: integrationOpenAI?.settings.url,
    });
  }, [integrationDiagrams, integrationGrist, integrationOpenAI, reset]);

  const handleSubmit = React.useCallback(
    async (data: FormData) => {
      try {
        console.log(data)
        if (data.drawIoUrl) {
          await integrations.save({
            id: integrationDiagrams?.id,
            type: IntegrationType.Embed,
            service: IntegrationService.Diagrams,
            settings: {
              url: data.drawIoUrl,
            },
          });
        } else {
          await integrationDiagrams?.delete();
        }

        if (data.gristUrl) {
          await integrations.save({
            id: integrationGrist?.id,
            type: IntegrationType.Embed,
            service: IntegrationService.Grist,
            settings: {
              url: data.gristUrl,
            },
          });
        } else {
          await integrationGrist?.delete();
        }

        if (data.chatUrl) {
          await integrations.save({
            id: integrationOpenAI?.id,
            type: IntegrationType.Embed,
            service: IntegrationService.OpenAI,
            settings: {
              url: data.chatUrl,
            },
          });
        } else {
          await integrationOpenAI?.delete();
        }

        toast.success(t("Settings saved"));
      } catch (err) {
        toast.error(err.message);
      }
    },
    [integrations, integrationDiagrams, integrationGrist, integrationOpenAI, t]
  );

  return (
    <Scene title={t("Self Hosted")} icon={<BuildingBlocksIcon />}>
      <Heading>{t("Self Hosted")}</Heading>

      <form onSubmit={formHandleSubmit(handleSubmit)}>
        <SettingRow
          label={t("Draw.io deployment")}
          name="drawIoUrl"
          description={t(
            "Add your self-hosted draw.io installation url here to enable automatic embedding of diagrams within documents."
          )}
          border={false}
        >
          <Input
            placeholder="https://app.diagrams.net/"
            pattern="https?://.*"
            {...register("drawIoUrl")}
          />
        </SettingRow>

        <SettingRow
          label={t("Grist deployment")}
          name="gristUrl"
          description={t("Add your self-hosted grist installation URL here.")}
          border={false}
        >
          <Input
            placeholder="https://docs.getgrist.com/"
            pattern="https?://.*"
            {...register("gristUrl")}
          />
        </SettingRow>

        <SettingRow
            label="Chat Server"
            name="chatUrl"
            description={t("Add your Chat server URL here in the form http://host:port/path~openai_api_key")}
            border={false}
        >
          <Input
              placeholder="http://xxx:xxx~sk-xxx"
              {...register("chatUrl")}
          />
        </SettingRow>

        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? `${t("Saving")}…` : t("Save")}
        </Button>
      </form>
    </Scene>
  );
}

export default observer(SelfHosted);
