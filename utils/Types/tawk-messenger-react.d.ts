declare module '@tawk.to/tawk-messenger-react' {
    import { ComponentType } from 'react';

    interface TawkMessengerProps {
        propertyId: string;
        widgetId: string;
    }

    const TawkMessenger: ComponentType<TawkMessengerProps>;
    export default TawkMessenger;
}