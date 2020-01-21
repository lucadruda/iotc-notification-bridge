import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { createNotificationHubService } from 'azure-sb'

const notificationService = createNotificationHubService(process.env['NotificationHubName'] as string, process.env['NotificationHubConnectionString'] as string);

interface InputFunctionContext extends Context {
    bindings: {
        sendMessage: {
            target: string,
            arguments: string[],
            userId?: string,
            groupName?: string
        }[]
    }

    res: {
        status?: number
        body: string
    }
}

type NotificationPayload = {
    data: {
        '@type': string[],
        displayName: string,
        name: string,
        '@id': string,
        value: any,
        interfaceInstanceName: string
    }[],
    application: {
        displayName: string,
        host: string,
        subdomain: string,
        id: string
    },
    displayName: string,
    rule: {
        displayName: string,
        id: string,
        enabled: boolean
    },
    id: string,
    device: {
        approved: boolean,
        provisioned: boolean,
        displayName: string,
        simulated: boolean,
        id: string,
        instanceOf: string
    },
    timestamp: string
}

const httpTrigger = async function (context: InputFunctionContext, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    if (req.body) {
        let ruleData: NotificationPayload = req.body;
        let payload = {
            data: {
                message: `${ruleData.displayName}: ${ruleData.rule.displayName} for device "${ruleData.device.displayName}" in application "${ruleData.application.displayName}". Value: ${ruleData.data[0].value}`
            }
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: payload.data.message
        };
        context.bindings.sendMessage = [{
            target: 'newMessage',
            userId: ruleData.device.id,
            arguments: [payload.data.message]
        }]

        notificationService.gcm.send(ruleData.device.id, payload, (err, res) => {
            if (err) {
                console.log(err);
            }
        });

        // notificationService.apns.send(null, payload, (err, res) => {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a compatible request body"
        };
    }
};

export default httpTrigger;
