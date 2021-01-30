package com.example.changekeeper;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;

public class ConfirmDialogueSet2 extends AppCompatDialogFragment{
    //Class used to confirm
    private String walletAmount;
    private String cardAmount;
    private String current;
    private String amount;
    private ConfirmDialogueSetListener2 listener;

    static ConfirmDialogueSet2 newInstance() {
        return new ConfirmDialogueSet2();
    }


    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Log.i("boi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_confirm_dialogue_set_card,null);



        readFile();
        Bundle args = getArguments();

        this.current = this.walletAmount;


        this.amount = args.getString("amount");
        Log.i(":(","fds wtfcrl " + this.amount);

        if(Double.parseDouble(amount)>0){
            ((TextView)view.findViewById(R.id.registered)).setText(amount + "€");
            ((TextView)view.findViewById(R.id.registered)).setTextColor(Color.parseColor("#2ecc71"));

        }
        else{
            ((TextView)view.findViewById(R.id.registered)).setText(amount + "€");
            ((TextView)view.findViewById(R.id.registered)).setTextColor(Color.parseColor("#e74c3c"));
        }

        ((TextView)view.findViewById(R.id.current)).setText(current + "€");

        if(Double.parseDouble(current)>0)
            ((TextView)view.findViewById(R.id.current)).setTextColor(Color.parseColor("#2ecc71"));
        else
            ((TextView)view.findViewById(R.id.current)).setTextColor(Color.parseColor("#e74c3c"));


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Log.i("puto","lololo");
                listener.confirm2(amount+"");
            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (ConfirmDialogueSetListener2) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement CategoryDialogueListener"));
        }
    }

    public interface ConfirmDialogueSetListener2{
        void confirm2(String amount);
    }


    private void readFile() {
        try {
            FileInputStream fileInputStream = getActivity().openFileInput("UserMoney.txt");
            InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream);

            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            this.walletAmount = bufferedReader.readLine();
            this.cardAmount = bufferedReader.readLine();

            bufferedReader.close();
            inputStreamReader.close();
            fileInputStream.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}


