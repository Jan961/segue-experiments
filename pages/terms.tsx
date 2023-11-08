import Link from 'next/link';
import Layout from '../components/guestLayout';
import { useRouter } from 'next/router';

import { Alert } from '../components/alert';
import { router } from 'next/client';

export default Terms;

function Terms() {
  const router = useRouter();
  return (
    <>
      <Layout title="Login | Segue">
        <Alert></Alert>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Terms And Conditions</h1>
              <button onClick={() => router.back()}>Back</button>
              <p className="mt-2 text-center text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sodales justo arcu, pharetra semper ante
                viverra nec. Mauris nec lectus non purus iaculis pharetra. Cras nec ex sed diam porta eleifend sed vel
                lectus. Nulla vitae dolor dolor. Suspendisse sit amet efficitur augue. Mauris ornare sapien eu massa
                mollis sodales. Nullam scelerisque dictum nulla, eu suscipit massa viverra quis. Sed at velit sodales,
                viverra lorem quis, vulputate massa. Sed vitae convallis sapien, quis aliquet nibh. Donec elementum
                nulla eu sodales convallis.
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Morbi quis placerat elit. Sed id felis nibh. Suspendisse potenti. Curabitur quis tellus eget nibh
                consectetur hendrerit. Mauris vitae arcu pellentesque, pharetra nibh in, venenatis lectus. Proin maximus
                euismod nibh, vitae porttitor ligula interdum non. Suspendisse tellus augue, sodales eu consectetur sed,
                lobortis non leo. Sed volutpat dolor quis dolor dictum imperdiet.
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Etiam maximus ligula sed lacinia ullamcorper. Etiam condimentum ut sapien quis volutpat. Praesent elit
                magna, mollis eu sagittis vel, dictum a ipsum. Cras semper arcu leo, eu egestas dui convallis quis.
                Integer ac aliquam velit. Aliquam maximus, ipsum in scelerisque interdum, ipsum justo sodales augue,
                eget condimentum leo leo sed sapien. Fusce sollicitudin lacus ligula, a viverra magna tristique at.
                Aliquam erat volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum iaculis a
                sapien ac vulputate. Vestibulum lacinia iaculis dapibus. Proin nec diam at nisl rutrum bibendum. Orci
                varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi sollicitudin
                purus vel eros pretium, et consectetur tortor fringilla.
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Donec eu egestas metus. Maecenas erat enim, suscipit accumsan nibh vel, feugiat convallis magna. Cras
                imperdiet eleifend nibh, et maximus mauris. Aliquam nec massa euismod, volutpat est at, accumsan dolor.
                Etiam pellentesque facilisis odio, quis rhoncus lorem sodales vitae. Curabitur fringilla a diam sed
                suscipit. Nunc vel dolor a nulla consequat gravida. Proin quis arcu pellentesque, pulvinar nunc sit
                amet, vehicula ex. Vivamus ultricies vehicula dolor. Sed bibendum ligula id ipsum commodo rutrum. Fusce
                ante erat, vehicula quis justo id, iaculis gravida nisi. Nulla vel mattis mi. Integer elementum, augue
                sed pharetra blandit, sapien tortor condimentum elit, id dictum leo massa vel mauris.
              </p>
              <p className="mt-2 text-center text-sm text-gray-600">
                Nulla leo quam, finibus et efficitur eu, imperdiet sed libero. Proin et ex sed massa eleifend imperdiet.
                Aliquam erat volutpat. Duis quis neque nisi. Cras vel convallis diam, eget tincidunt nunc. Etiam luctus
                metus eros, eu egestas nisl ullamcorper ut. Fusce id finibus sem. Proin porttitor turpis nunc, id
                dignissim erat mattis quis. Curabitur dignissim metus vitae finibus pulvinar. Duis dignissim facilisis
                risus, sed pharetra massa gravida at. Nam facilisis, nisi id efficitur tristique, est odio molestie
                magna, non tempor libero tortor vel libero. In commodo id eros eu mollis. Aliquam eros urna, consectetur
                eu odio ut, ullamcorper ultricies risus. Pellentesque habitant morbi tristique senectus et netus et
                malesuada fames ac turpis egestas. In hac habitasse platea dictumst.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
